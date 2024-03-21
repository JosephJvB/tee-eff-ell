const https = require('https')

const stDominicsToCamden =
  'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory'

function nativeFetch(url) {
  let data = ''

  return new Promise((resolve, reject) => {
    https
      .request(new URL(stDominicsToCamden), (response) => {
        response.on('data', (chunk) => {
          console.log('data')
          data += chunk
        })
        response.on('end', () => {
          console.log('end')
          resolve(data)
        })
        response.on('error', (error) => {
          console.log('error')
          reject(error)
        })
      })
      .on('error', (error) => {
        console.log('request error')
        reject({
          error,
          data,
        })
      })
      .end()
  })
}

console.time('request')
nativeFetch(stDominicsToCamden)
  .then((r) => {
    console.log('success', r)
    console.timeEnd('request')
  })
  .catch((e) => {
    console.error('failed', e)
  })
