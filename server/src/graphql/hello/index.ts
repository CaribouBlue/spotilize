'use strict'

// schema
export const typeDef = `
  extend type Query {
    hello: String
  }
`;

// resolvers
export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    },
  },
};
