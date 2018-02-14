import _ from 'lodash'
import {
  createSelector,
} from 'reselect'

import {
  shipsSelector,
  constSelector,
} from 'views/utils/selectors'

import {
  goalTableSelector,
  getShipInfoFuncSelector,
} from './common'

const shipsInfoSelector = createSelector(
  shipsSelector,
  getShipInfoFuncSelector,
  (rawShips, getShipInfo) =>
    _.values(rawShips).map(x => getShipInfo(x.api_id))
)

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

/*
   split goal table into two parts:
   - goalPairs is an Array of ({ship: <ShipInfo>, goal: <Goal>})
   with unspecified order
   - invalidShipIds is an Array of shipIds that does not have a ShipInfo

   TODO: removing invalid ships using observers
 */
const splitGoalPairsSelector = createSelector(
  getShipInfoFuncSelector,
  goalTableSelector,
  (getShipInfo, goalTable) => {
    const invalidShipIds = []
    const goalPairs = []
    _.toPairs(goalTable).map(([rstIdStr, goal]) => {
      const rstId = Number(rstIdStr)
      const ship = getShipInfo(rstId)
      if (ship) {
        goalPairs.push({ship, goal})
      } else {
        invalidShipIds.push(rstId)
      }
    })
    return {goalPairs, invalidShipIds}
  }
)

const goalPairsSelector = createSelector(
  splitGoalPairsSelector,
  s => s.goalPairs
)

export * from './common'

export {
  shipsInfoSelector,
  splitGoalPairsSelector,
  goalPairsSelector,
  shipTypeInfoSelector,
}
