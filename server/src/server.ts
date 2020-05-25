'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import memorystore from 'memorystore'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import {v4 as uuid} from 'uuid'

import * as spotify from '@services/spotify'
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

// spotify auth handler
app.get('/auth/spotify', async (req, res) => {
  const spotifySess = req.session.spotify
  const {code, state} = req.query
  if (!spotifySess) {
    res.redirect('/')
  } else if (spotifySess.state !== state) {
    res.send(400)
  } else {
    try {
      const grant = await spotify.getGrant(code.toString())
      req.session.spotify = {grant}
      res.redirect(spotifySess.originalUrl)
    } catch (error) {
      console.error(error)
      res.status(500).send({error})
    }
  }
})

app.use(async (req, res, next) => {
  const spotifySess = req.session.spotify
  if (!spotifySess || !spotifySess.grant) {
    const state = uuid()
    const {originalUrl} = req
    req.session.spotify = {state, originalUrl}
    const spotifyAuthURL = spotify.getAuthorizeURL(state)
    res.redirect(spotifyAuthURL)
  } else {
    if (!spotify.grantIsValid(spotifySess.grant)) {
      const newGrant = await spotify.getGrant(spotifySess.grant.refresh_token, true)
      req.session.spotify.grant = newGrant
    }
    next()
  }
})

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
