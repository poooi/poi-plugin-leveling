import { getMapExpInfo } from '../map-exp'

const assert = require('assert')

const spec = it

describe('mapExp', () => {
  spec('examples', () => {
    assert.deepEqual(
      getMapExpInfo('3-2'),
      {
        name: "キス島沖",
        baseExp: {
          type: "single",
          value: 320,
        },
      })

    assert.deepEqual(
      getMapExpInfo('4-5'),
      {
        name: "[Extra] カレー洋リランカ島沖",
        baseExp: {
          type: "range",
          min: 180,
          max: 440,
        },
      })
  })
})
