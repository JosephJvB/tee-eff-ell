import * as cheerio from 'cheerio'
import { selectors } from './config'

export const getHtml = async (url: string) => {
  const response = await fetch(url)

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`failed to fetch url ${url}`)
  }

  return text
}

export const extractJson = (html: string) => {
  const $ = cheerio.load(html)

  const stringValue = $(selectors.jsonElement).val()

  const asArray = JSON.parse(stringValue.replace(/&quot;/g, '"'))

  return asArray as JsonResponseItem[]
}

export type JsonResponseItem = {
  $type: string
  id: string
  operationType: number
  vehicleId: string
  naptanId: string
  stationName: string
  lineId: string
  lineName: string
  platformName: string
  direction: string
  bearing: string
  destinationNaptanId: string
  destinationName: string
  timestamp: string
  timeToStation: number
  currentLocation: string
  towards: string
  expectedArrival: string
  timeToLive: string
  modeName: string
  timing: {
    $type: string
    countdownServerAdjustment: string
    source: string
    insert: string
    read: string
    sent: string
    received: string
  }
}
