'use strict'

import {AxiosError} from 'axios'


export const processError = (axiosError: AxiosError) => {
  const {config, code, request, response} = axiosError
  const {status, statusText, data} = response
  const json = axiosError.toJSON()
  throw {status, text: statusText, details: {...json, data}}
}
