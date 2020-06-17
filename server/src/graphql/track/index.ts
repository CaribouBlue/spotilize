'use strict'

import * as spotify from '@services/spotify'
import * as tuple from '@utils/tuple'

import {Artist} from '@graphql/artist'

// schema
export const typeDef = `
  extend type Query {
    getTrack(trackID: ID): Track
  }

  type Track {
    availableMarkets: [String]
    discNumber: Int
    durationMs: Int
    episode: Boolean
    explicit: Boolean
    externalIds: Tuple
    externalUrls: Tuple
    href: String
    id: String
    isLocal: Boolean
    name: String
    popularity: Int
    previewUrl: String
    track: Boolean
    trackNumber: Int
    type: String
    uri: String
    artists: [Artist]
  }

`;

// album: Album

export class Track {
  grant: spotify.Grant
  trackID: string
  _trackPromise: Promise<spotify.Track>

  constructor(grant: spotify.Grant, trackID: string) {
    this.grant = grant
    this.trackID = trackID
    this._trackPromise = null
  }

  get trackPromise(): Promise<spotify.Track> {
    if (!this._trackPromise) {
      this._trackPromise = spotify.getTrack(this.grant, this.trackID)
    }
    return this._trackPromise
  }

  // async album(): Promise<Album> {
  //   const track = await this.trackPromise
  //   return track.album
  // }
  //

  async artists(): Promise<Artist[]> {
    const track = await this.trackPromise
    return track.artists.map(artistData => {
      const artist = new Artist(this.grant, artistData.id)

      artist.externalUrls = async () =>
        tuple.fromObj(artistData.external_urls)
      artist.href = async () =>
        artistData.href
      artist.id = async () =>
        artistData.id
      artist.name = async () =>
        artistData.name
      artist.type = async () =>
        artistData.type
      artist.uri = async () =>
        artistData.uri
        
      return artist
    })
  }

  async availableMarkets(): Promise<[string]> {
    const track = await this.trackPromise
    return track.available_markets
  }

  async discNumber(): Promise<number> {
    const track = await this.trackPromise
    return track.disc_number
  }

  async durationMs(): Promise<number> {
    const track = await this.trackPromise
    return track.duration_ms
  }

  async episode(): Promise<boolean> {
    const track = await this.trackPromise
    return track.episode
  }

  async explicit(): Promise<boolean> {
    const track = await this.trackPromise
    return track.explicit
  }

  async externalIds(): Promise<Tuple[]> {
    const track = await this.trackPromise
    return tuple.fromObj(track.external_ids)
  }

  async externalUrls(): Promise<Tuple[]> {
    const track = await this.trackPromise
    return tuple.fromObj(track.external_urls)
  }

  async href(): Promise<string> {
    const track = await this.trackPromise
    return track.href
  }

  async id(): Promise<string> {
    const track = await this.trackPromise
    return track.id
  }

  async isLocal(): Promise<boolean> {
    const track = await this.trackPromise
    return track.is_local
  }

  async name(): Promise<string> {
    const track = await this.trackPromise
    return track.name
  }

  async popularity(): Promise<number> {
    const track = await this.trackPromise
    return track.popularity
  }

  async previewUrl(): Promise<string> {
    const track = await this.trackPromise
    return track.preview_url
  }

  async track(): Promise<boolean> {
    const track = await this.trackPromise
    return track.track
  }

  async trackNumber(): Promise<number> {
    const track = await this.trackPromise
    return track.track_number
  }

  async type(): Promise<string> {
    const track = await this.trackPromise
    return track.type
  }

  async uri(): Promise<string> {
    const track = await this.trackPromise
    return track.uri
  }


}

// resolvers
export const resolvers = {
  Query: {
    getTrack: async (_obj: any, args: any, req: any, _info: any) => {
      const {grant} = req.session.spotify
      return new Track(grant, args.trackID)
    },
  },
};
