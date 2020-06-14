'use strict'

import * as spotify from '@services/spotify'
import * as tuple from '@utils/tuple'

// schema
export const typeDef = `
  extend type Query {
    getArtist(artistID: ID): Artist
  }

  type Artist {
    externalUrls: [Tuple]
    followers: Int
    genres: [String]
    href: String
    id: String
    images: [String]
    name: String
    popularity: Int
    type: String
    uri: String
  }

`;

export class Artist {
  grant: spotify.Grant
  artistID: string
  _artistPromise: Promise<spotify.Artist>

  constructor(grant: spotify.Grant, artistID: string) {
    this.grant = grant
    this.artistID = artistID
    this._artistPromise = null
  }

  get artistPromise(): Promise<spotify.Artist> {
    if (!this._artistPromise) {
      this._artistPromise = spotify.getArtist(this.grant, this.artistID)
    }
    return this._artistPromise
  }

  async externalUrls(): Promise<Tuple[]> {
    const artist = await this.artistPromise
    return tuple.fromObj(artist.external_urls)
  }

  async followers(): Promise<number> {
    const artist = await this.artistPromise
    return artist.followers.total
  }

  async genres(): Promise<[string]> {
    const artist = await this.artistPromise
    return artist.genres
  }

  async href(): Promise<string> {
    const artist = await this.artistPromise
    return artist.href
  }

  async id(): Promise<string> {
    const artist = await this.artistPromise
    return artist.id
  }

  async images(): Promise<string[]> {
    const artist = await this.artistPromise
    return artist.images.map(image => image.url)
  }

  async name(): Promise<string> {
    const artist = await this.artistPromise
    return artist.name
  }

  async popularity(): Promise<number> {
    const artist = await this.artistPromise
    return artist.popularity
  }

  async type(): Promise<string> {
    const artist = await this.artistPromise
    return artist.type
  }

  async uri(): Promise<string> {
    const artist = await this.artistPromise
    return artist.uri
  }

}

// resolvers
export const resolvers = {
  Query: {
    getArtist: async (_obj: any, args: any, req: any, _info: any) => {
      const {grant} = req.session.spotify
      return new Artist(grant, args.artistID)
    },
  },
};
