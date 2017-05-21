import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const rawTable1 = readJsonSync(join(__dirname, 'assets', 'exp_1_99.json'))
const rawTable2 = readJsonSync(join(__dirname, 'assets', 'exp_100_155.json'))

const verifyData = assert => {
  const verifyRawTable = rawTable => {
    assert( Array.isArray( rawTable ) && rawTable.length > 0, "type & length sanity check")
    assert( rawTable[0][1] === 0 && rawTable[0][2] === 0, "initial data row")
    const go = (curTotal,row) => {
      assert(row.length === 3, `Incorrect col count`)
      const [lvl,diff,total] = row
      assert(curTotal + diff === total, `Data inconsistent at level ${lvl}`)
      return total
    }
    rawTable.reduce(go,0)
  }
  verifyRawTable(rawTable1)
  verifyRawTable(rawTable2)
}

export {
  verifyData,
}
