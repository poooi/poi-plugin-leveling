import { createSelector } from 'reselect'

import {
  shipsSelector,
  constSelector,
  fleetsSelector,
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import {
  computeNextRemodelLevel,
  computeAllRemodelsFromMstId,
  remodelToRGoal,
} from './remodel'

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
        typeName, stype, sortNo,
        name, level,
        fleet,
        evasion, asw, los, locked,
        expToNext, totalExp,
        nextRemodelLevel: computeNextRemodelLevel($ships,mstId,level),
      }
    })
  })

const admiralIdSelector = createSelector(
  basicSelector,
  d => parseInt(d.api_member_id,10))

const goalTableSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  s => s.goalTable)

const levelingConfigSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  s => s.config)

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

// split ship list into two parts:
// 'shipsWithoutGoal' is the ship list for ships without goal
// 'goalPairs' is the GoalPair list for ships that has a goal,
//   in which every element has properly paired {goal,ship} together
const shipListSplitSelector = createSelector(
  shipsInfoSelector,
  admiralIdSelector,
  goalTableSelector,
  (ships, admiralId, goalTable) => {
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

const goalAreaUISelector = createSelector(
  admiralIdSelector,
  shipTypeInfoSelector,
  shipListSplitSelector,
  (admiralId, stypeInfo, {shipsWithoutGoal, goalPairs}) => ({
    ships: shipsWithoutGoal,
    admiralId,
    stypeInfo,
    goalPairs,
  })
)

const rGoalMaxUnmarried = {
  goalLevel: 99,
  reason: { type: 'max-unmarried' },
}

const rGoalMaxMarried = {
  goalLevel: 155,
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

    return {
      rmdGoals,
    }
  }
)

const methodTemplateUISelector = createSelector(
  shipTypeInfoSelector,
  levelingConfigSelector,
  shipListSplitSelector,
  (stypeInfo,config,{goalPairs}) => {
    const purgeGoalPair = ({goal,ship}) => ({
      name: ship.name,
      stype: ship.stype,
      rstId: ship.rstId,
      level: ship.level,
      goalLevel: goal.goalLevel,
    })
    const shipTargets = goalPairs
      .map(purgeGoalPair)
      .filter(x => x.level < x.goalLevel)
    return {
      stypeInfo,
      config,
      // Ship targets to be applied to
      shipTargets,
    }
  }
)

export {
  goalTableSelector,
  goalAreaUISelector,
  recommendedGoalsSelector,
  levelingConfigSelector,
  methodTemplateUISelector,
  shipListSplitSelector,
}
