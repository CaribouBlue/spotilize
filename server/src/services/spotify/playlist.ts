'use strict'

import {handleRequest} from '@utils/axios'
import config from 'config'

import {Grant, User, Playlist} from './types';

const spotifyApiHost = config.get('spotify.apiHost')

export const getPlaylist = async (grant: Grant, playlistID: string): Promise<Playlist> => {
  const endpoint = `/playlists/${playlistID}`
  const url = `${spotifyApiHost}${endpoint}`
  const resp = await handleRequest('get', url, {
    headers: {
      Authorization: `Bearer ${grant.access_token}`
    },
  })
  return resp.data
}
