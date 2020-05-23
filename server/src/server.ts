'use strict';

import config  from 'config'
import express from 'express'
import morgan from 'morgan'

const app = express()
const port: string | number = config.get('server.port')

export {app, port}
