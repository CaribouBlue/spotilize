'use strict'

import {handleRequest} from '@utils/axios'
import config from 'config'

import {Grant, Artist} from './types';

const spotifyApiHost = config.get('spotify.apiHost')

export const getArtist = async (grant: Grant, artistID: string): Promise<Artist> => {
  const endpoint = `/artists/${artistID}`
  const url = `${spotifyApiHost}${endpoint}`
  const resp = await handleRequest('get', url, {
    headers: {
      Authorization: `Bearer ${grant.access_token}`
    },
  })
  return resp.data
}
