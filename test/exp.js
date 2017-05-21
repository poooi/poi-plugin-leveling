import * as exp from '../exp'

const assert = require('assert')

const spec = it

describe('exp', () => {
  spec('verify raw data', () => exp.verifyData(assert))
})
