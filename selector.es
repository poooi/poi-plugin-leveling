import { createSelector } from 'reselect'

import {
  shipsSelector,
  constSelector,
  fleetsSelector,
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

const shipsInfoSelector = createSelector(
  shipsSelector,
  constSelector,
  fleetsSelector,
  (rawShips, rawConst, fleets) => {
    const { $ships, $shipTypes } = rawConst
    return Object.keys(rawShips).map( rstIdStr => {
      const rstId = parseInt(rstIdStr,10)
      const ship = rawShips[rstIdStr]
      const totalExp = ship.api_exp[0]
      const expToNext = ship.api_exp[1]
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
      return {
        rstId,
        typeName,
        stype,
        name,
        level,
        fleet,
        evasion,
        asw,
        los,
        locked,
        expToNext,
        totalExp,
        sortNo,
      }
    })
  })

const admiralIdSelector = createSelector(
  basicSelector,
  d => parseInt(d.api_member_id,10))

const goalTableSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  s => s.goalTable)

const shipTypeInfoSelector = createSelector(
  constSelector,
  constData => {
    const { $shipTypes } = constData
    const result = Object.keys($shipTypes).map( k => {
      const info = $shipTypes[k]
      return {id: info.api_id, name: info.api_name}
    })
    return result.sort((a,b) => a.id-b.id)
  })

const mainUISelector = createSelector(
  shipsInfoSelector,
  admiralIdSelector,
  goalTableSelector,
  shipTypeInfoSelector,
  (ships, admiralId, goalTable, stypeInfo) => {
    if (goalTable === null)
      return { ships, admiralId, goalPairs: [], stypeInfo }
    const shipsWithoutGoal = []
    const goalPairs = []
    ships.map(s => {
      const goal = goalTable[s.rstId]
      if (typeof goal === 'undefined') {
        shipsWithoutGoal.push(s)
      } else {
        goalPairs.push({ship: s, goal})
      }
    })
    return {
      ships: shipsWithoutGoal,
      admiralId,
      goalPairs,
      stypeInfo,
    }
  }
)

export {
  shipsInfoSelector,
  admiralIdSelector,
  goalTableSelector,
  mainUISelector,
}
