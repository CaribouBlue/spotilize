'use strict'

export const fromObj = (obj: any): Tuple[] => {
  return Object.entries(obj).map(([key, value]) => {
    return {key, value}
  })
}
