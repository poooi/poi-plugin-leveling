import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'

import {
  shipsSelector,
  constSelector,
} from 'views/utils/selectors'

import {
  computeAllRemodelsFromMstId,
  remodelToRGoal,
} from '../remodel'

import {
  Template,
  TemplateList,
} from '../structs'

import {
  extSelector,
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

// split ship list into two parts:
// 'shipsWithoutGoal' is the ship list for ships without goal
// 'goalPairs' is the GoalPair list for ships that has a goal,
//   in which every element has properly paired {goal,ship} together
const shipListSplitSelector = createSelector(
  shipsInfoSelector,
  goalTableSelector,
  (ships, goalTable) => {
    if (goalTable === null)
      return {
        shipsWithoutGoal: [],
        goalPairs: [],
      }
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
      shipsWithoutGoal,
      goalPairs,
    }
  }
)

const enabledTemplateListSelector = createSelector(
  templateListSelector,
  templates =>
    templates.filter(Template.isEnabled),
)

const rGoalMaxUnmarried = {
  goalLevel: 99,
  reason: { type: 'max-unmarried' },
}

const rGoalMaxMarried = {
  goalLevel: 165,
  reason: { type: 'max-married' },
}

const recommendedGoalsSelector = createSelector(
  constSelector,
  shipsSelector,
  goalTableSelector,
  (rawConst, ships, goalTable) => {
    const { $ships, $shipTypes } = rawConst
    const remodelToRGoalF = remodelToRGoal($ships,$shipTypes)
    const rmdGoals = {}
    Object.keys(goalTable).map(rstIdStr => {
      const ship = ships[rstIdStr]
      if (typeof ship === 'undefined')
        return
      const mstId = ship.api_ship_id
      // without taking into account levels
      const remodelRGoals = computeAllRemodelsFromMstId($ships,mstId)
        .map(remodelToRGoalF)
      // include all goals, filter through and sort.
      const rGoals = [...remodelRGoals, rGoalMaxUnmarried, rGoalMaxMarried]
        .filter( g => g.goalLevel > ship.api_lv )
        .sort( (x,y) => x.goalLevel - y.goalLevel)

      rmdGoals[rstIdStr] = rGoals
    })

    return rmdGoals
  }
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

const findMethodFuncSelector = createSelector(
  enabledTemplateListSelector,
  templateList => _.memoize(stype =>
    TemplateList.findMethod(templateList,false)(stype)
  )
)

export * from './common'

export {
  recommendedGoalsSelector,
  methodTemplateUISelector,
  shipListSplitSelector,
  findMethodFuncSelector,
  shipsInfoSelector,
  splitGoalPairsSelector,
  goalPairsSelector,
  shipTypeInfoSelector,
}
