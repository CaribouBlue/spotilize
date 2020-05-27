'use strict';

import * as path from 'path'

// set up config
process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, '../config/')
const deployment: string = process.env['NODE_ENV'] || 'developement'
const instance: string | null = process.env['NODE_APP_INSTANCE'] || null;
const configFile = deployment + (instance ? '-' + instance : '')
console.info(`Using config ${configFile}`)

// set up module aliases
require('module-alias/register')

// run server
import {port, app} from './server'

app.listen(port, () => {
  console.info(`::: node server listening to port ${port} :::`)
})
