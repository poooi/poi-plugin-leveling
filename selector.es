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
      const expToNext = ship.api_exp[1]
      const mstId = ship.api_ship_id
      const $ship = $ships[mstId]
      const name = $ship.api_name
      const typeName = $shipTypes[$ship.api_stype].api_name
      const level = ship.api_lv
      const [evasion, asw, los] = [ship.api_kaihi[0],ship.api_taisen[0],ship.api_sakuteki[0]]
      const locked = ship.api_locked !== 0
      const fleetInd = fleets.findIndex( fleet => fleet.api_ship.indexOf(rstId) !== -1)
      const fleet = fleetInd === -1 ? null : fleets[fleetInd].api_id
      return {
        rstId,
        typeName,
        name,
        level,
        fleet,
        evasion,
        asw,
        los,
        locked,
        expToNext,
      }
    })
  })

const admiralIdSelector = createSelector(
  basicSelector,
  d => parseInt(d.api_member_id,10))

const goalTableSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  s => s.goalTable)

const mainUISelector = createSelector(
  shipsInfoSelector,
  admiralIdSelector,
  goalTableSelector,
  (ships, admiralId, goalTable) => {
    if (goalTable === null)
      return { ships, admiralId, goalPairs: [] }
    // const goalIds = Object.keys(goalTable).map(x => parseInt(x,10))
    const shipsWithoutGoal = []
    const goalPairs = []
    ships.map(s => {
      const goal = goalTable[s.rstId]
      if (typeof goal === 'undefined') {
        shipsWithoutGoal.push(s)
      } else {
        goalPairs.push([s,goal])
      }
    })
    return {
      ships: shipsWithoutGoal,
      admiralId,
      goalPairs,
    }
  }
)

export {
  shipsInfoSelector,
  admiralIdSelector,
  goalTableSelector,
  mainUISelector,
}
