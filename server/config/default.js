const uuid = require('uuid').v4

module.exports = {
  server: {
    port: process.env.PORT
      || console.warn('server using default port')
      || 1337,
    morganFormat: 'tiny',
    session: {
      secret: process.env.SESSION_SECRET
        || console.warn('server using random session secret')
        || uuid(),
      cookie: {
        secure: true,
      }
    }
  }
}
