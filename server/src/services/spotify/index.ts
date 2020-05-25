'use strict'

import config from 'config'
import qs from 'query-string'
import axios, {Method, AxiosRequestConfig} from 'axios'

import * as axiosUtils from '@utils/axios'

import {Grant} from './types';

const clientID: string = config.get('spotify.clientID')
const redirectURI: string = config.get('spotify.redirectURI')
const clientSecret: string = config.get('spotify.clientSecret')

const auth = {
  username: clientID,
  password: clientSecret,
}

export const getAuthorizeURL = (state?: string): string => {
  const params: any = {
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirectURI,
    state: state,
    scope: null,
    show_dialog: false,
  }
  const queryString = qs.stringify(params)
  const url = `https://accounts.spotify.com/authorize?${queryString}`
  return url
}

const handleRequest = async (method: Method, url: string, config: AxiosRequestConfig) => {
  try {
    return await axios({
      method,
      url,
      ...config,
    })
  } catch (error) {
    if (error.isAxiosError) {
      axiosUtils.processError(error)
    }
  }
}

export const getGrant = async (code: string): Promise<Grant> => {
  const url = 'https://accounts.spotify.com/api/token'
  const resp = await handleRequest('post', url, {
    auth,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.get('spotify.redirectURI'),
    }),
  })
  return {
    ...resp.data,
    expires_at: Date.now() + (resp.data.expires_in - 60) * 1000
  }
}
