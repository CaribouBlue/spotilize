const defaultConfig = require('./default')
const merge = require('lodash.merge')

module.exports = merge(
  defaultConfig,
  {
    server: {
      port: 1337,
      session: {
        secret: 'killacats',
        cookie: {
          secure: false,
        },
      },
    },
  }
)
