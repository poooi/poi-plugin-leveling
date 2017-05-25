import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const _ = require('lodash')

const mapExpTable = readJsonSync(join(__dirname, 'assets', 'map_exp.json'))
const getMapExpInfo = map => mapExpTable[map]

const sortedMapKeys = (() => {
  const ret = Object.keys(mapExpTable)
  const norm = x => parseInt(x.replace(/-/g, ""),10)

  ret.sort( (x,y) => norm(x) - norm(y))
  return Object.freeze(ret)
})()

const expValueFromBaseExp = baseExp => {
  if (baseExp.type === 'standard')
    return getMapExpInfo(baseExp.map).baseExp
  if (baseExp.type === 'custom')
    return baseExp.value
  console.error(`Invalid BaseExp type: ${baseExp.type}`)
}

// returns non-empty array
const expValueToArray = expValue => {
  if (expValue.type === 'single')
    return [expValue.value]
  if (expValue.type === 'range')
    return [expValue.min, expValue.max]

  console.error(`Invalid ExpValue type: ${expValue.type}`)
}

const rankTable = {
  S: 1.2,
  A: 1.0,
  B: 1.0,
  C: 0.8,
  D: 0.7,
  E: 0.5,
}

const computeExp = (base,flagship,mvpFlag,rank) => {
  const mvpFactor =
      rank === 'E' ? 1
    : (mvpFlag ? 2 : 1)

  const rankFactor = rankTable[rank]
  const flagshipFactor = flagship ? 1.5 : 1
  return Math.floor(base * mvpFactor * rankFactor * flagshipFactor)
}

// returns a sorted array of possible exp obtained from the specified leveling method
const computePossibleExps = method => {
  if (method.type === 'sortie') {
    const { flagship, mvp } = method
    const ranks = method.rank
    const baseExps = expValueToArray(expValueFromBaseExp(method.baseExp))
    const mvpFlags =
        mvp === 'yes' ? [true]
      : mvp === 'no' ? [false]
      : mvp === 'maybe' ? [false, true]
      : console.error(`Invalid mvp value: ${mvp}`)

    return _.uniq(
      _.flatMap(baseExps, baseExpNum =>
        _.flatMap(mvpFlags, mvpFlag =>
          _.flatMap(ranks, rank =>
            computeExp(baseExpNum,flagship,mvpFlag,rank))))
       .sort((x,y) => x-y))
  }

  if (method.type === 'custom') {
    return expValueToArray( method.exp )
  }

  console.error(`Invalid method type: ${method.type}`)
}

// purge a sorted non-empty array
// - keeps singleton intact
// - if there are more than one value,
//   only the first and the last are kept
const purgeNonEmpty = ne => {
  if (ne.length === 0)
    console.error('expecting non-empty array')
  return ne.length === 1 ? ne : [ne[0], ne[ne.length-1]]
}

const computeExpRange = method =>
  purgeNonEmpty(computePossibleExps(method))

export {
  getMapExpInfo,
  expValueFromBaseExp,
  computeExp,
  computePossibleExps,
  computeExpRange,
  sortedMapKeys,
}
