'use strict'
const cheerio = require('cheerio')

const stDominicsToCamden =
  'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory?lineId=24'

exports.handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request

  if (request.method === 'OPTIONS') {
    return callback(null, {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
        ],
      },
    })
  }
  if (request.method !== 'GET') {
    callback(null, {
      status: '400',
      statusDescription: 'invalid method',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
        ],
      },
    })
  }

  try {
    // const tflHtml = await nativeFetch(stDominicsToCamden)
    const tflHtml = await getHtml(stDominicsToCamden)

    const jsonItems = extractJson(tflHtml)

    jsonItems.sort((a, z) => a.timeToStation - z.timeToStation)

    // test html response
    // const jsonItems = Array(5)
    //   .fill(0)
    //   .map((_, i) => ({
    //     timeToStation: i * 60 + 5,
    //     lineName: '24',
    //     destinationName: 'St Dominic&#39;s Priory',
    //   }))

    const htmlResponse = constructHtml(jsonItems)

    const response = {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
        ],
      },
      body: htmlResponse,
    }

    callback(null, response)
  } catch (error) {
    console.error('failed', { error })
    callback(error)
  }
}

/**
 * @param {JsonResponseItem} item
 * @returns {string}
 */
function jsonToListItem(item) {
  const mins = Math.floor(item.timeToStation / 60)
  const secs = item.timeToStation - mins * 60
  return [
    '<li>',
    `<strong style="color:red;">${item.lineName}</strong>`,
    ` ${item.destinationName} `,
    `<strong>${mins}mins ${secs}secs</strong>`,
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
