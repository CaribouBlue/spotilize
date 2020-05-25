const defaultConfig = require('./default')
const merge = require('lodash.merge')

module.exports = merge(
  defaultConfig,
  {
    server: {
      session: {
        secret: 'killacats',
        cookie: {
          secure: false,
        },
      },
    },
  }
)
