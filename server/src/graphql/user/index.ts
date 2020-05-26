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
  displayName: string
  externalUrls: {
    key: string,
    value: string,
  }[]
  followers: number
  href: string
  id: string
  images: string[]
  type: string
  uri: string
  constructor(user: spotify.User) {
    this.displayName = user.display_name
    this.externalUrls = Object.entries(user.external_urls)
      .map(tuple => ({key: tuple[0], value: tuple[1]}))
    this.followers = user.followers.total
    this.href = user.href
    this.id = user.id
    this.images = user.images.map(image => image.url)
    this.type = user.type
    this.uri = user.uri
  }
}

// resolvers
export const resolvers = {
  Query: {
    getUser: async (_obj: any, args: any, req: any, _info: any) => {
      const {grant} = req.session.spotify
      const user: spotify.User = await spotify.getUser(grant, args.userID)
      return new User(user)
    },
  },
};
