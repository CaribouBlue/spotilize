'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import memorystore from 'memorystore'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import {v4 as uuid} from 'uuid'

import * as spotify from '@services/spotify'

import * as hello from '@graphql/hello'
import * as user from '@graphql/user'
import * as playlist from '@graphql/playlist'

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

  type Tuple {
    key: String
    value: String
  }
`
const typeDefs = [Query, hello.typeDef, user.typeDef, playlist.typeDef]
const resolvers = [hello.resolvers, user.resolvers, playlist.resolvers]
const schema = makeExecutableSchema({ typeDefs, resolvers });
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

// route fall through handler
app.get('*', (req, res) => {
  res.send('<h1>hello world</h1>')
})

export {app, port}
