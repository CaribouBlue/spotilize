'use strict'

import {handleRequest} from '@utils/axios'
import config from 'config'

import {Grant, Track} from './types';

const spotifyApiHost = config.get('spotify.apiHost')

export const getTrack = async (grant: Grant, trackID: string): Promise<Track> => {
  const endpoint = `/tracks/${trackID}`
  const url = `${spotifyApiHost}${endpoint}`
  const resp = await handleRequest('get', url, {
    headers: {
      Authorization: `Bearer ${grant.access_token}`
    },
  })
  return resp.data
}
