'use strict'

import axios, {AxiosError, AxiosRequestConfig, Method} from 'axios'

export const processError = (axiosError: AxiosError) => {
  const {config, code, request, response} = axiosError
  const {status, statusText, data} = response
  const json = axiosError.toJSON()
  throw {status, text: statusText, details: {...json, data}}
}

export const handleRequest = async (method: Method, url: string, config: AxiosRequestConfig) => {
  try {
    return await axios({
      method,
      url,
      ...config,
    })
  } catch (error) {
    if (error.isAxiosError) {
      processError(error)
    }
  }
}
