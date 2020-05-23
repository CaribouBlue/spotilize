'use strict';

const path = require('path')

// set up config
process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, '../config/')
const deployment: string = process.env['NODE_ENV'] || 'default'
const instance: string | null = process.env['NODE_APP_INSTANCE'] || null;
const configFile = deployment + (instance ? '-' + instance : '')
console.info(`Using config ${configFile}`)
