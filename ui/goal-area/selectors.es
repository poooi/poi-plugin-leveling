import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  projectorToComparator,
  chainComparators,
} from 'subtender'

import {
  shipsSelector,
  constSelector,
} from 'views/utils/selectors'

import {
  uiSelector,
  goalPairsSelector,
  goalTableSelector,
} from '../../selectors'

import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'

import {
  rosterIdComparator as sRosterIdComparator,
  inGameLevelComparator as sInGameLevelComparator,
  inGameShipTypeComparator as sInGameShipTypeComparator,
} from '../../shiplist-ops'

import {
  computeAllRemodelsFromMstId,
  remodelToRGoal,
} from '../../remodel'

const goalTabSelector = createSelector(
  uiSelector,
  ui => ui.goalTab
)

const sortMethodSelector = createSelector(
  goalTabSelector,
  g => g.sortMethod
)

const on = cmp => prj => (x,y) => cmp(prj(x),prj(y))

// wrap ship comparator to work on GoalPairs
const wrapShipComparator = cmp => on(cmp)(x => x.ship)

const prepareSorter = ({method, reversed}) => {
  const rosterIdComparator = wrapShipComparator(sRosterIdComparator)
  const levelComparator =
    wrapShipComparator(sInGameLevelComparator)
  const stypeComparator =
    wrapShipComparator(sInGameShipTypeComparator)

  const comparator =
    method === 'rid' ? rosterIdComparator :
    method === 'stype' ? stypeComparator :
    method === 'level' ? levelComparator :
    method === 'remaining-exp' ? projectorToComparator(x => x.extra.remainingExp) :
    method === 'remaining-battles-lb' ? projectorToComparator(x => x.extra.remainingBattles[0]) :
    console.error(`Unknown sorting method: ${method}`)

  // as every ship has a unique rosterId
  // we use this as the final resolver if necessary
  // so that the compare result is always non-zero unless we are comparing the same ship
  const comparatorResolved = chainComparators(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.

  // note that "xs" is expected to be used internally, and since there's no other access
  // to it, we can just reverse the Array in place
  const doReverse = reversed ? xs => xs.reverse() : _.identity

  return xs => doReverse([...xs].sort(comparatorResolved))
}

const sortFuncSelector = createSelector(
  sortMethodSelector,
  prepareSorter
)

const extendedGoalPairsSelector = createSelector(
  goalPairsSelector,
  sortFuncSelector,
  (goalPairs, sort) =>
    sort(
      goalPairs.map(({ship, goal}) => {
        // adding "extra" field, which contains exp-related info, into GoalPair
        // we call this structure EGoalPair (E for Extended)
        const remainingExp = Math.max(0,totalExp(goal.goalLevel) - ship.totalExp)
        const expRange = computeExpRange(goal.method)
        const remainingBattles =
          _.uniq(
            expRange.map(exp => Math.ceil(remainingExp / exp))
          ).reverse() // as division flips the list
        const extra = {
          remainingExp,
          remainingBattles,
        }
        return {
          ship,
          goal,
          extra,
        }
      })
    )
)

const rGoalMaxUnmarried = {
  goalLevel: 99,
  reason: { type: 'max-unmarried' },
}

const rGoalMaxMarried = {
  goalLevel: 180,
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

export {
  sortMethodSelector,
  extendedGoalPairsSelector,
  recommendedGoalsSelector,
}
