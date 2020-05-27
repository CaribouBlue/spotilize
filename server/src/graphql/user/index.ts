'use strict'

import * as spotify from '@services/spotify'

// schema
export const typeDef = `
  extend type Query {
    getUser(userID: ID): User
  }

  type User {
    displayName: String
    externalUrls: [Tuple]
    followers: Int
    href: String
    id: ID
    images: [String]
    type: String
    uri: String
  }

`;

export class User {
  grant: spotify.Grant
  userID: string
  _userPromise: Promise<spotify.User>

  constructor(grant: spotify.Grant, userID: string) {
    this.grant = grant
    this.userID = userID
    this._userPromise = null
  }

  get userPromise(): Promise<spotify.User> {
    if (!this._userPromise) {
      this._userPromise = spotify.getUser(this.grant, this.userID)
    }
    return this._userPromise
  }

  async displayName(): Promise<string> {
    const user = await this.userPromise
    return user.display_name
  }

  async followers(): Promise<number> {
    const user = await this.userPromise
    return user.followers.total
  }

  async externalUrls(): Promise<Tuple[]> {
    const user = await this.userPromise
    return Object.entries(user.external_urls)
      .map(tuple => ({key: tuple[0], value: tuple[1]}))
  }

  async href(): Promise<string> {
    const user = await this.userPromise
    return user.href
  }

  async id(): Promise<string> {
    const user = await this.userPromise
    return user.id
  }

  async type(): Promise<string> {
    const user = await this.userPromise
    return user.type
  }

  async images(): Promise<string[]> {
    const user = await this.userPromise
    return user.images.map(image => image.url)
  }

  async uri(): Promise<string> {
    const user = await this.userPromise
    return user.uri
  }
}

// resolvers
export const resolvers = {
  Query: {
    getUser: async (_obj: any, args: any, req: any, _info: any) => {
      const {grant} = req.session.spotify
      return new User(grant, args.userID)
    },
  },
};
