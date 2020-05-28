'use strict'

import {handleRequest} from '@utils/axios'
import config from 'config'

import {Grant, User, Playlist} from './types';

const spotifyApiHost = config.get('spotify.apiHost')

export const getUser = async (grant: Grant, userID: string): Promise<User> => {
  const endpoint = userID
    ? `/users/${userID}`
    : '/me'
  const url = `${spotifyApiHost}${endpoint}`
  const resp = await handleRequest('get', url, {
    headers: {
      Authorization: `Bearer ${grant.access_token}`
    },
  })
  return resp.data
}

export const getUsersPlaylists = async (grant: Grant, userID: string): Promise<[Playlist]> => {
  const endpoint = userID
    ? `/users/${userID}/playlists`
    : '/me/playlists'
  const url = `${spotifyApiHost}${endpoint}`
  const resp = await handleRequest('get', url, {
    headers: {
      Authorization: `Bearer ${grant.access_token}`
    },
  })
  return resp.data
}
