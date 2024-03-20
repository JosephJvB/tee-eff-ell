export const baseUrl =
  'https://tfl.gov.uk/travel-information/stations-stops-and-piers/'

export const stDominicsStop =
  'https://tfl.gov.uk/bus/stop/490G00012651/st-dominics-priory/?Input=St+Dominic%27s+Priory'

export const urls = {
  base: 'https://tfl.gov.uk/travel-information/stations-stops-and-piers/',
  stDominicsStop: {
    base: 'https://tfl.gov.uk/bus/stop/490G00012651/st-dominics-priory/?Input=St+Dominic%27s+Priory',
    toCamden: {
      base: 'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory',
      24: 'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory?lineId=24',
      46: 'https://tfl.gov.uk/bus/stop/490012651S/st-dominics-priory?lineId=46',
    },
  },
}

export const selectors = {
  liveArrivalsList: 'ol.live-board-feed',
  liveArrivalItem: 'li.live-board-feed-item',
  arrivalItemTime: 'span.live-board-eta',
  jsonElement: 'input#json-response',
}
