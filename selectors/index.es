import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'

import {
  shipsSelector,
  constSelector,
  fleetsSelector,
} from 'views/utils/selectors'

import {
  computeNextRemodelLevel,
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
} from './common'

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
    // TODO: stype => stypeId, make "getShipTypeInfoFuncSelector"
    // also "validShipTypesSelector" to eliminate types that has no registered ships
    const stype = $ship.api_stype
    const level = ship.api_lv
    const [evasion, asw, los] = [ship.api_kaihi[0],ship.api_taisen[0],ship.api_sakuteki[0]]
    const locked = ship.api_locked !== 0
    const fleetInd = fleets.findIndex( fleet => fleet.api_ship.indexOf(rstId) !== -1)
    const fleet = fleetInd === -1 ? null : fleets[fleetInd].api_id

    return {
      rstId,
      typeName, stype, sortNo, mstId,
      name, level,
      fleet,
      evasion, asw, los, locked,
      expToNext, totalExp,
      nextRemodelLevel: computeNextRemodelLevel($ships,mstId,level),
    }
  })
)

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

const goalAreaUISelector = createSelector(
  shipTypeInfoSelector,
  shipListSplitSelector,
  enabledTemplateListSelector,
  (stypeInfo, {shipsWithoutGoal, goalPairs}, templates) => ({
    ships: shipsWithoutGoal,
    stypeInfo,
    goalPairs,
    templates,
  })
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

const goalSorterSelector = createSelector(
  extSelector,
  ext => _.get(ext, ['ui', 'goalTab', 'sortMethod'])
)

const virtualConfigSelector = createStructuredSelector({
  goalSorter: goalSorterSelector,
  templates: templateListSelector,
})

const levelingConfigSelector = virtualConfigSelector

const methodTemplateUISelector = createSelector(
  shipTypeInfoSelector,
  virtualConfigSelector,
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

const findMethodFuncSelector = createSelector(
  enabledTemplateListSelector,
  templateList => _.memoize(stype =>
    TemplateList.findMethod(templateList,false)(stype)
  )
)

export * from './common'

export {
  goalAreaUISelector,
  recommendedGoalsSelector,
  levelingConfigSelector,
  methodTemplateUISelector,
  shipListSplitSelector,
  findMethodFuncSelector,
  shipsInfoSelector,
  getShipInfoFuncSelector,
  splitGoalPairsSelector,
}
