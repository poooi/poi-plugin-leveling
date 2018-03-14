/*
   common selectors are selectors that require minimum
   dependencies to work, this includes:

   - direct store accessors
   - data that can directly drived from store

 */
import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  basicSelector,
  wctfSelector,
  extensionSelectorFactory,
  configSelector as poiConfSelector,
  fleetsSelector,
  constSelector,
  shipsSelector,
} from 'views/utils/selectors'

import { minimum } from '../default-template-list'
import { initState } from '../store/init-state'

import {
  computeNextRemodelLevel,
} from '../remodel'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  ext => _.isEmpty(ext) ? initState : ext
)

{
  // debugging util
  const {getStore} = window
  window.getExt = () => extSelector(getStore())
}

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName])
)

const uiSelector =
  mkExtPropSelector('ui')
const templatesSelector =
  mkExtPropSelector('templates')
const pReadySelector =
  mkExtPropSelector('pReady')
const goalsSelector =
  mkExtPropSelector('goals')

const goalsAdmiralIdSelector = createSelector(
  goalsSelector,
  g => g.admiralId
)

// internal only, please use goalTableSelector.
const goalsGoalTableSelector = createSelector(
  goalsSelector,
  g => g.goalTable
)

const admiralIdSelector = createSelector(
  basicSelector,
  basic => {
    const raw = _.get(basic, 'api_member_id')
    // the conversion is safe, as we know it comes from game API
    return raw ? Number(raw) : null
  }
)

/*
   check whether <extStore>.goals is ready:
   for it to be ready, admiralId must be vaild and match current admiralId
 */
const goalsReadySelector = createSelector(
  goalsAdmiralIdSelector,
  admiralIdSelector,
  (goalsAdmiralId, admiralId) =>
    goalsAdmiralId && admiralId && goalsAdmiralId === admiralId
)

const goalTableSelector = createSelector(
  goalsGoalTableSelector,
  goalsReadySelector,
  (goalTable, ready) => ready ? goalTable : {}
)

const shipStatsAtLevelFuncSelector = createSelector(
  wctfSelector,
  wctf => _.memoize(mstId => {
    const statInfo = _.get(wctf,['ships',mstId,'stat'])
    if (!statInfo) {
      return _level => ({evasion: null, asw: null, los: null})
    } else {
      return level =>
        _.fromPairs(
          ['evasion', 'asw', 'los'].map(statName => {
            const stBase = statInfo[statName]
            const stMax = statInfo[`${statName}_max`]
            let statVal = null
            if (
              _.isInteger(stBase) && stBase >= 0 &&
              _.isInteger(stMax) && stMax >= 0
            ) {
              statVal = stBase + Math.floor((stMax - stBase) * level / 99)
            }
            return [statName, statVal]
          })
        )
    }
  })
)

const templateListSelector = createSelector(
  pReadySelector,
  templatesSelector,
  (pReady, templates) =>
    pReady ? templates : minimum
)

const themeSelector = createSelector(
  poiConfSelector,
  conf => _.get(conf, 'poi.theme', 'paperdark')
)

/*
   returns a function: rstId => ShipInfo,
   the ShipInfo should contain most of the info needed for this plugin
 */
const getShipInfoFuncSelector = createSelector(
  shipsSelector,
  constSelector,
  fleetsSelector,
  (rawShips, {$ships = null, $shipTypes = null}, fleets) => _.memoize(rstId => {
    if (_.isEmpty($ships) || _.isEmpty($shipTypes))
      return null
    if (!(rstId in rawShips))
      return null

    const ship = rawShips[rstId]
    const [totalExp, expToNext] = ship.api_exp
    const mstId = ship.api_ship_id
    const $ship = $ships[mstId]
    const sortNo = $ship.api_sortno
    const name = $ship.api_name
    const typeName = $shipTypes[$ship.api_stype].api_name
    const stype = $ship.api_stype
    const level = ship.api_lv
    const [evasion, asw, los] = [ship.api_kaihi[0],ship.api_taisen[0],ship.api_sakuteki[0]]
    const locked = ship.api_locked !== 0
    const fleetInd = fleets.findIndex( fleet => fleet.api_ship.indexOf(rstId) !== -1)
    const fleet = fleetInd === -1 ? null : fleets[fleetInd].api_id

    // modernization
    const modern = {
      luck: ship.api_kyouka[4],
      hp: ship.api_kyouka[5],
      asw: ship.api_kyouka[6],
    }

    return {
      rstId,
      typeName, stype, sortNo, mstId,
      name, level,
      fleet,
      evasion, asw, los, locked,
      modern,
      expToNext, totalExp,
      nextRemodelLevel: computeNextRemodelLevel($ships,mstId,level),
    }
  })
)

const getShipTypeInfoFuncSelector = createSelector(
  constSelector,
  ({$shipTypes = null}) => _.memoize(stypeId => {
    if (!$shipTypes || !(stypeId in $shipTypes))
      return null
    const $shipType = $shipTypes[stypeId]
    return {
      id: $shipType.api_id,
      name: $shipType.api_name,
    }
  })
)

// all stypes used by friendly ships, sorted Array.
const validShipTypeIdsSelector = createSelector(
  constSelector,
  ({$ships = null}) =>
    _.uniq(
      _.values($ships).filter(s => s.api_id <= 1500).map(s => s.api_stype)
    ).sort((x,y) => x-y)
)

export {
  extSelector,
  uiSelector,
  templatesSelector,
  templateListSelector,
  pReadySelector,

  admiralIdSelector,
  shipStatsAtLevelFuncSelector,
  goalsReadySelector,
  goalsGoalTableSelector,
  goalsAdmiralIdSelector,
  goalTableSelector,
  themeSelector,
  getShipInfoFuncSelector,
  getShipTypeInfoFuncSelector,
  validShipTypeIdsSelector,
}
