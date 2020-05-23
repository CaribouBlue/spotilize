'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'

const app = express()
const port: string | number = config.get('server.port')

// MIDDLEWARE
const morganFormat: string = config.get('server.morganFormat')
app.use(morgan(morganFormat))

//ROUTES
app.get('/', (req, res) => {
  res.send('hello world')
})

export {app, port}
