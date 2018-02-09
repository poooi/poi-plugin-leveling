import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { totalExp } from '../../../exp'
import { computeExpRange } from '../../../map-exp'

import { GoalBox } from './goal-box'
import { GoalSorterRow } from './goal-sorter-row'

import {
  recommendedGoalsSelector,
  levelingConfigSelector,
} from '../../../selectors'

import * as SC from '../../../shiplist-ops'

const {
  chainComparators,
  getter2Comparator,
} = SC

const on = cmp => prj => (x,y) => cmp(prj(x),prj(y))

// wrap ship comparator to work on GoalPairs
const wrapShipComparator = cmp => on(cmp)(x => x.ship)

// adding "extra" field, which contains exp-related info, into GoalPair
// we call this structure EGoalPair (E for Extended)
const extendGoalPair = ({ship, goal}) => {
  const remainingExp = Math.max(0,totalExp(goal.goalLevel) - ship.totalExp)
  const expRange = computeExpRange(goal.method)
  const remainingBattles =
    _.uniq(expRange.map( exp => Math.ceil(remainingExp / exp)))
      .reverse() // as division flips the list

  const extra = {
    remainingExp,
    remainingBattles,
  }

  return {
    ship,
    goal,
    extra,
  }
}

const prepareSorter = ({method, reversed}) => {
  const rosterIdComparator = wrapShipComparator(SC.rosterIdComparator)
  const levelComparator =
    wrapShipComparator(SC.inGameLevelComparator)

  const stypeComparator =
    wrapShipComparator(SC.inGameShipTypeComparator)

  const comparator =
      method === 'rid' ? rosterIdComparator
    : method === 'stype' ? stypeComparator
    : method === 'level' ? levelComparator
    : method === 'remaining-exp' ? getter2Comparator(x => x.extra.remainingExp)
    : method === 'remaining-battles-lb' ? getter2Comparator(x => x.extra.remainingBattles[0])
    : console.error(`Unknown sorting method: ${method}`)

  // as every ship has a unique rosterId
  // we use this as the final resolver if necessary
  // so that the compare result is always non-zero unless we are comparing the same ship
  const comparatorResolved = chainComparators(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.
  const doReverse = reversed ? xs => [...xs].reverse() : _.identity

  return xs => doReverse(xs.sort(comparatorResolved))
}

// a list containing ship leveling goals
class GoalListImpl extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    rmdGoals: PTyp.objectOf(PTyp.arrayOf(PTyp.RGoalLevel)).isRequired,
    goalSorter: PTyp.GoalListSorter.isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
    onModifyConfig: PTyp.func.isRequired,
  }

  handleModifySorter = modifier => {
    const { onModifyConfig } = this.props
    onModifyConfig( config => ({
      ...config,
      goalSorter: modifier(config.goalSorter),
    }))
  }

  render() {
    const { goalPairs, onModifyGoalTable, rmdGoals, goalSorter } = this.props
    const sorter = prepareSorter(goalSorter)
    const eGoalPairs = sorter(goalPairs.map(extendGoalPair))
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <GoalSorterRow />
        <ListGroup
          style={{
            height: 0,
            flex: 1,
            overflowY: 'auto',
          }}
          className="goal-list">
          {
            eGoalPairs.map(eGoalPair => {
              const { ship } = eGoalPair
              return (
                <GoalBox
                  onModifyGoalTable={onModifyGoalTable}
                  key={ship.rstId}
                  rGoals={rmdGoals[ship.rstId]}
                  eGoalPair={eGoalPair} />
              )
            })
          }
        </ListGroup>
      </div>
    )
  }
}

const GoalList = connect(
  state => ({
    ...recommendedGoalsSelector(state),
    ...levelingConfigSelector(state),
  }),
  // mapDispatchToProps,
)(GoalListImpl)

export { GoalList }
