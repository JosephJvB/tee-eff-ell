'use strict'
const cheerio = require('cheerio')

const stDominicsToCamden =
  'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory'

exports.handler = async (event, context, callback) => {
  // ah but it's hard to scrape without cheerio no?
  const tflHtml = await getHtml(stDominicsToCamden)

  const jsonItems = extractJson(tflHtml)

  jsonItems.sort((a, z) => a.timeToStation - z.timeToStation)

  const htmlResponse = constructHtml(jsonItems)

  // add headers and stuff
  return htmlResponse
}

/**
 * @param {JsonResponseItem} item
 * @returns {string}
 */
function jsonToListItem(item) {
  const arrivalMins = (item.timeToStation / 60).toFixed(2)
  return [
    '<li>',
    `<strong style="color:red;">${item.lineName}</strong>`,
    ` ${item.destinationName} `,
    `<strong>${arrivalMins}mins</strong>`,
    '</li>',
  ].join('')
}

/**
 * @param {JsonResponseItem[]} items
 * @returns {string}
 */
function constructHtml(items) {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<title>Document</title>',
    '</head>',
    '<body>',
    '<h1>St Dominics arrivals to Camden</h1>',
    '<ol>',
    ...items.map((i) => jsonToListItem(i)),
    '</ol>',
    '</body>',
    '</html>',
  ].join('\n')
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function getHtml(url) {
  const response = await fetch(url)

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`failed to fetch url ${url}`)
  }

  return text
}

/**
 * @typedef {{
 *   $type: string
 *   id: string
 *   operationType: number
 *   vehicleId: string
 *   naptanId: string
 *   stationName: string
 *   lineId: string
 *   lineName: string
 *   platformName: string
 *   direction: string
 *   bearing: string
 *   destinationNaptanId: string
 *   destinationName: string
 *   timestamp: string
 *   timeToStation: number
 *   currentLocation: string
 *   towards: string
 *   expectedArrival: string
 *   timeToLive: string
 *   modeName: string
 *   timing: {
 *     $type: string
 *     countdownServerAdjustment: string
 *     source: string
 *     insert: string
 *     read: string
 *     sent: string
 *     received: string
 *   }
 * }} JsonResponseItem
 */

/**
 * @param {string} html
 * @returns {JsonResponseItem[]}
 */
function extractJson(html) {
  const $ = cheerio.load(html)

  const stringValue = $('input#json-response').val()

  const asArray = JSON.parse(stringValue.replace(/&quot;/g, '"'))

  return asArray
}
