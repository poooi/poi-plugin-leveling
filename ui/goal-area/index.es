import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import { mergeMapStateToProps } from 'subtender'

import {
  goalAreaUISelector,
  recommendedGoalsSelector,
  levelingConfigSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'

import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'

import * as SC from '../../shiplist-ops'

import { GoalBox } from './goal-list/goal-box'
import { GoalSorterRow } from './goal-list/goal-sorter-row'

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

class GoalAreaImpl extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    rmdGoals: PTyp.objectOf(PTyp.arrayOf(PTyp.RGoalLevel)).isRequired,
    goalSorter: PTyp.GoalListSorter.isRequired,
    modifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const { goalPairs, modifyGoalTable, rmdGoals, goalSorter } = this.props
    const sorter = prepareSorter(goalSorter)
    const eGoalPairs = sorter(goalPairs.map(extendGoalPair))

    return (
      <div
        className="goal-area"
        style={{height: '100%'}}
      >
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
                    modifyGoalTable={modifyGoalTable}
                    key={ship.rstId}
                    rGoals={rmdGoals[ship.rstId]}
                    eGoalPair={eGoalPair} />
                )
              })
            }
          </ListGroup>
        </div>
      </div>
    )
  }
}

const GoalArea = connect(
  mergeMapStateToProps(
    goalAreaUISelector,
    state => ({
      ...recommendedGoalsSelector(state),
      ...levelingConfigSelector(state),
    }),
  ),
  mapDispatchToProps,
)(GoalAreaImpl)

export { GoalArea }
