'use strict'

import * as spotify from '@services/spotify'

import * as tuple from '@utils/tuple'

import {User} from '@graphql/user'
import {Track} from '@graphql/track'

// schema
export const typeDef = `
  extend type Query {
    getPlaylist(playlistID: ID!): Playlist
  }

  type Playlist {
    collaborative: Boolean
    description: String
    externalUrls: [Tuple]
    followers: Int
    href: String
    id: ID
    images: [String]
    name: String
    public: Boolean
    snapshotId: String
    type: String
    uri: String
    owner: User
    tracks: [PlaylistTrack]
  }

  type PlaylistTrack {
    addedAt: String
    addedBy: User
    isLocal: Boolean
    videoThumbnail: String
    track: Track
  }
`;

export class Playlist {
  grant: spotify.Grant
  playlistID: string
  _playlistPromise: Promise<spotify.Playlist>

  constructor(grant: spotify.Grant, playlistID: string ) {
    this.grant = grant
    this.playlistID = playlistID
    this._playlistPromise = null
  }

  get playlistPromise() {
    if (!this._playlistPromise) {
      this._playlistPromise = spotify.getPlaylist(this.grant, this.playlistID)
    }
    return this._playlistPromise
  }

  async collaborative(): Promise<boolean> {
    const playlist = await this.playlistPromise
    return playlist.collaborative
  }

  async description(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.description
  }

  async externalUrls(): Promise<Tuple[]> {
    const playlist = await this.playlistPromise
    return Object.entries(playlist.external_urls)
      .map(tuple => ({key: tuple[0], value: tuple[1]}))
  }

  async followers(): Promise<number> {
    const playlist = await this.playlistPromise
    return playlist.followers.total
  }

  async href(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.href
  }

  async id(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.id
  }

  async images(): Promise<string[]> {
    const playlist = await this.playlistPromise
    return playlist.images.map(image => image.url)
  }

  async name(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.name
  }

  async public(): Promise<boolean> {
    const playlist = await this.playlistPromise
    return playlist.public
  }

  async snapshotId(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.snapshot_id
  }

  async tracks(): Promise<PlaylistTrack[]> {
    const playlist = await this.playlistPromise
    return playlist.tracks.items.map(plt => new PlaylistTrack(this.grant, plt))
  }

  async type(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.type
  }

  async uri(): Promise<string> {
    const playlist = await this.playlistPromise
    return playlist.uri
  }

  async owner(): Promise<User> {
    const playlist = await this.playlistPromise
    const owner = new User(this.grant, playlist.owner.id)
    owner.displayName = async () =>
      playlist.owner.display_name
    owner.externalUrls = async () =>
      Object.entries(playlist.owner.external_urls)
        .map(tuple => ({key: tuple[0], value: tuple[1]}))
    owner.href = async () =>
      playlist.owner.href
    owner.id = async () =>
      playlist.owner.id
    owner.type = async() =>
      playlist.owner.type
    owner.uri = async() =>
      playlist.owner.uri
    return owner
  }
}

export class PlaylistTrack {
  playlistTrack: spotify.PlaylistTrack
  grant: spotify.Grant
  constructor(grant: spotify.Grant, playlistTrack: spotify.PlaylistTrack) {
    this.grant = grant
    this.playlistTrack = playlistTrack
  }

  addedAt(): string {
     return this.playlistTrack.added_at
  }

  isLocal(): boolean {
    return this.playlistTrack.is_local
  }

  videoThumbnail(): string {
    return this.playlistTrack.video_thumbnail.url
  }

  async addedBy(): Promise<User> {
    const userData = this.playlistTrack.added_by
    const user = new User(this.grant, userData.id)
    user.externalUrls = async () => tuple.fromObj(userData.external_urls)
    user.href = async () => userData.href
    user.id = async () => userData.id
    user.type = async () => userData.type
    user.uri = async () => userData.uri
    return user
  }

  async track(): Promise<Track> {
    const trackData = this.playlistTrack.track
    const track = new Track(this.grant, trackData.id)
    // track.album = async () => trackData.album
    // track.artists = async () => trackData.artists
    track.availableMarkets = async () => trackData.available_markets
    track.discNumber = async () => trackData.disc_number
    track.durationMs = async () => trackData.duration_ms
    track.episode = async () => trackData.episode
    track.explicit = async () => trackData.explicit
    track.externalIds = async () => tuple.fromObj(trackData.external_ids)
    track.externalUrls = async () => tuple.fromObj(trackData.external_urls)
    track.href = async () => trackData.href
    track.id = async () => trackData.id
    track.isLocal = async () => trackData.is_local
    track.name = async () => trackData.name
    track.popularity = async () => trackData.popularity
    track.previewUrl = async () => trackData.preview_url
    track.track = async () => trackData.track
    track.trackNumber = async () => trackData.track_number
    track.type = async () => trackData.type
    track.uri = async () => trackData.uri
    return track
  }
}

// resolvers
export const resolvers = {
  Query: {
    getPlaylist: async (_obj: any, args: any, req: any, _info: any) => {
      const {grant} = req.session.spotify
      return new Playlist(grant, args.playlistID)
    },
  },
};
