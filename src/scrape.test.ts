import { readFileSync } from 'fs'
import { urls } from './config'
import { extractJson, getHtml, nativeFetch } from './scrape'
import { join } from 'path'

describe('scrape', () => {
  describe('getHtml', () => {
    it('can load st dominics 24 bus to camden html', async () => {
      // const input = urls.stDominicsStop.toCamden[24]
      const input = urls.stDominicsStop.toCamden.base

      // console.time('getHtml')
      const html = await getHtml(input)
      // console.timeEnd('getHtml') // 500ms

      expect(html).toBeDefined()
      expect(html.length).toBeGreaterThan(100)
    })
  })

  describe('extractJson', () => {
    it('pulls json from html', () => {
      const input = readFileSync(
        join(__dirname, '../stdoms-24-to-camden.html'),
        'utf8'
      )

      const json = extractJson(input)

      expect(json).toBeDefined()
      expect(Array.isArray(json)).toBe(true)
      expect(json.length).toBe(8)
    })
  })

  describe('native fetch', () => {
    it(
      'works',
      async () => {
        const input = urls.stDominicsStop.toCamden[24]

        // console.time('getHtml')
        const html = await nativeFetch(input)
        // console.timeEnd('getHtml') // 500ms

        expect(html).toBeDefined()
        expect(html.length).toBeGreaterThan(100)
      },
      30 * 1000
    )
  })
})
