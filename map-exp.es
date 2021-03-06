import _ from 'lodash'
import { generalComparator } from 'subtender'
import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { Ternary, ExpValue, BaseExp, Method } from './structs'

const mapExpTable = readJsonSync(join(__dirname, 'assets', 'map_exp.json'))

const availableMapIds = _.keys(mapExpTable).map(Number).sort(generalComparator)

const getMapExpInfo = mapId => mapExpTable[mapId]

const sortedMapIds =
  _.sortBy(_.keys(mapExpTable).map(Number), _.identity)

const expValueFromBaseExp =
  BaseExp.toExpValueWithGetter(mapId => getMapExpInfo(mapId).baseExp)

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
    rank === 'E' ? 1 : (mvpFlag ? 2 : 1)

  const rankFactor = rankTable[rank]
  const flagshipFactor = flagship ? 1.5 : 1
  return Math.floor(base * mvpFactor * rankFactor * flagshipFactor)
}

// returns a sorted array of possible exp obtained from the specified leveling method
const computePossibleExps = Method.destruct({
  sortie: (flagship,mvp,ranks,baseExp) => {
    const flagshipFlags = Ternary.toArray(flagship)
    const baseExps = ExpValue.toArray(expValueFromBaseExp(baseExp))
    const mvpFlags = Ternary.toArray(mvp)
    return _.uniq(
      _.flatMap(baseExps, baseExpNum =>
        _.flatMap(mvpFlags, mvpFlag =>
          _.flatMap(flagshipFlags, flagshipFlag =>
            _.flatMap(ranks, rank =>
              computeExp(baseExpNum,flagshipFlag,mvpFlag,rank)))))
        .sort((x,y) => x-y))
  },
  custom: exp => ExpValue.toArray(exp),
})

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
  availableMapIds,
  getMapExpInfo,
  expValueFromBaseExp,
  computeExp,
  computePossibleExps,
  computeExpRange,
  sortedMapIds,
}
