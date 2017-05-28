import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const statsTable = readJsonSync(join(__dirname, 'assets', 'wctf_stats.json'))

const estimateStat = statInfo => level => {
  if (typeof statInfo !== 'object')
    return null
  const { base, max } = statInfo
  if (typeof base !== 'number' || typeof max !== 'number')
    return null
  return base + Math.floor((max - base)*level/99)
}

const statsAtLevel = mstId => {
  const statEntity = statsTable[mstId]
  if (typeof statEntity === 'undefined')
    return () => ({ evasion: null, asw: null, los: null })

  return level => ['evasion','asw','los']
    .reduce((obj, statName) => ({
      ...obj,
      [statName]: estimateStat(statEntity[statName])(level),
    }), {})
}

export { statsAtLevel }
