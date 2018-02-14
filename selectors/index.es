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
  templateListSelector,
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

const methodTemplateUISelector = createSelector(
  shipTypeInfoSelector,
  templateListSelector,
  goalPairsSelector,
  (stypeInfo,templates,goalPairs) => {
    const purgeGoalPair = ({goal,ship}) => ({
      name: ship.name,
      stype: ship.stype,
      rstId: ship.rstId,
      level: ship.level,
      goalLevel: goal.goalLevel,
    })
    const shipTargets = goalPairs.filter(pair =>
      pair.ship.level < pair.goal.goalLevel
    ).map(purgeGoalPair)

    return {
      stypeInfo,
      templates,
      // Ship targets to be applied to
      shipTargets,
    }
  }
)

export * from './common'

export {
  methodTemplateUISelector,
  shipsInfoSelector,
  splitGoalPairsSelector,
  goalPairsSelector,
  shipTypeInfoSelector,
}
