import {
  statsAtLevel,
} from '../ship-stat'

const assert = require('assert')

const spec = it

describe('shipStat', () => {
  spec('statsAtLevel', () => {
    const eal = (e,a,l) => ({
      evasion: e,
      asw: a,
      los: l,
    })

    const testCase = (mstId,level,expectedEAL) =>
      assert.deepEqual(
        statsAtLevel(mstId)(level),
        expectedEAL)

    testCase(null,10,eal(null,null,null))
    testCase(318,146,eal(77,0,94))
    testCase(184,131,eal(43,0,55))
    testCase(185,132,eal(56,0,76))

    testCase(347,116,eal(99,86,52))
    testCase(307,111,eal(88,88,64))
  })
})
