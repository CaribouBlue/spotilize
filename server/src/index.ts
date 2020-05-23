'use strict';

import * as path from 'path'

// set up config
process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, '../config/')
const deployment: string = process.env['NODE_ENV'] || 'default'
const instance: string | null = process.env['NODE_APP_INSTANCE'] || null;
const configFile = deployment + (instance ? '-' + instance : '')
console.info(`Using config ${configFile}`)

// run server
import {port, app} from './server'

app.listen(() => {
  console.info(`::: node server listening to port ${port} :::`)
})
