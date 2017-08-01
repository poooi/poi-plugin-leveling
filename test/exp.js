import {
  verifyData,
  totalExp,
} from '../exp'

const assert = require('assert')

const spec = it

describe('exp', () => {
  spec('verifyData', () => verifyData(assert))

  spec('totalExp examples', () => {
    const test = (input, output) => assert.equal(totalExp(input),output)
    test(1,0)
    test(2,100)
    test(50,122500)
    test(99,1000000)
    const marriedDiff = totalExp(99)
    test(100,marriedDiff)
    test(147,2799000+marriedDiff)
    test(155,4470000+marriedDiff)
    test(165,6820000+marriedDiff)
  })
})
