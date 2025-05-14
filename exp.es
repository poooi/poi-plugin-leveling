import _ from 'lodash'
import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { MAX_LEVEL } from './consts'

const rawTable1 = readJsonSync(join(__dirname, 'assets', 'exp_1_99.json'))
const rawTable2 = readJsonSync(join(__dirname, 'assets', 'exp_100_max.json'))

// verify that data is consistent in both rawTable1 and rawTable2
// and properly sorted by level (Level 1~99 for rawTable1 and Level 100~<max level> for rawTable2)
const verifyData = assert => {
  const verifyRawTable = (rawTable,initRow,finalRow) => {
    assert( Array.isArray( rawTable ) && rawTable.length > 0, "type & length sanity check")
    assert.deepEqual(rawTable[0], initRow)
    const go = (expected,row) => {
      assert(row.length === 3, `Incorrect col count`)
      const [lvl,diff,total] = row
      assert(expected.lvl === lvl, `Level out of order`)
      assert(expected.total === total - diff, `Data inconsistent at level ${lvl}`)
      return { lvl: expected.lvl+1, total: expected.total+diff }
    }
    rawTable.reduce(go,{lvl: initRow[0], total: 0})
    assert.deepEqual(rawTable[rawTable.length-1],finalRow)
  }
  verifyRawTable(
    rawTable1,
    [1,0,0], [99,148500,1000000])
  verifyRawTable(
    rawTable2,
    [100,0,0], [185,1_000_000,15_000_000])
}

const totalExpTable = (() => {
  const table = new Array(1+MAX_LEVEL);

  [...rawTable1, ...rawTable2].reduce(
    (curTotal,[lvl,diff]) => {
      const newTotal = curTotal+diff
      table[lvl] = newTotal
      return newTotal
    }, 0)

  return table
})()

// total experience required for a ship to reach certain level
const totalExp = lvl => totalExpTable[lvl]

// TODO: fix tests instead of running this manually.

/* eslint-disable no-console */
window.levelingVerifyData = (() => {
  const assertObj = (tt, reason = null) => {
    console.assert(tt, reason)
  }

  assertObj.deepEqual = (x, y) => {
    const result = _.isEqual(x, y)
    console.assert(result, 'asserted deepEqual')
    if (!result) {
      console.error('left', x)
      console.error('right', y)
    }
  }

  return () => {
    console.log('Will now verify ...')
    verifyData(assertObj)
    console.log('Verification executed.')
  }
})()
/* eslint-enable no-console */

export {
  verifyData,
  totalExp,
}
