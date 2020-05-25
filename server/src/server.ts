'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import memorystore from 'memorystore'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'

import * as helloGql from './graphql/hello'

const app = express()
const port: string | number = config.get('server.port')

// request info logging
const morganFormat: string = config.get('server.morganFormat')
app.use(morgan(morganFormat))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set up session handeling
const MemoryStore = memorystore(session)
const sessionOptions: any = {
  secret: config.get('server.session.secret'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: config.get('server.session.cookie.secure') },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}
app.use(session(sessionOptions))

// graphql setup
const Query = `
  type Query {
    _empty: String
  }
`
const schema = makeExecutableSchema({
  typeDefs: [Query, helloGql.typeDef],
  resolvers: [helloGql.resolvers],
});
app.use('/graphql', graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// route fall through handler
app.get('*', (req, res) => {
  res.send('<h1>hello world</h1>')
})

export {app, port}
