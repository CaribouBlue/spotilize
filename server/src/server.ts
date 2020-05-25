'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'

import * as helloGql from './graphql/hello'

const app = express()
const port: string | number = config.get('server.port')

// MIDDLEWARE
const morganFormat: string = config.get('server.morganFormat')
app.use(morgan(morganFormat))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// GRAPHQL
const Query = `
  type Query {
    _empty: String
  }
`
const schema = makeExecutableSchema({
  typeDefs: [Query, helloGql.typeDef],
  resolvers: [helloGql.resolvers],
});

//ROUTES
app.use('/graphql', graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('*', (req, res) => {
  res.send('<h1>hello world</h1>')
})

export {app, port}
