const uuid = require('uuid').v4

module.exports = {
  server: {
    port: process.env.PORT,
    morganFormat: 'tiny',
    session: {
      secret: process.env.SESSION_SECRET,
      cookie: {
        secure: true,
      },
    },
  },
  spotify: {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectURI: 'http://localhost:1337/auth/spotify',
    apiHost: 'https://api.spotify.com/v1',
  },
}
