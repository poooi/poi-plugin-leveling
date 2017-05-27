import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'
import { identity } from '../../utils'

import { GoalBox } from './goal-box'
import { GoalSorterRow } from './goal-sorter-row'

const { _ } = window

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

// TODO: merge with those in ShipPicker's
// use first comparator, but if the first returns 0, use the second comparator instead
const composeComparator = (cmp1,cmp2) => (x,y) => {
  const result1 = cmp1(x,y)
  return result1 !== 0 ? result1 : cmp2(x,y)
}

const flipComparator = cmp => (x,y) => cmp(y,x)

// create a comparator assuming the getter projects a numeric value from elements
const getter2Comparator = getter => (x,y) => getter(x)-getter(y)

const prepareSorter = ({method, reversed}) => {
  const rosterIdComparator = getter2Comparator(x => x.ship.rstId)
  const levelComparator =
    composeComparator(
      flipComparator(getter2Comparator(x => x.ship.level)),
      composeComparator(
        getter2Comparator(x => x.ship.sortNo),
        rosterIdComparator))

  const stypeComparator =
    composeComparator(
      flipComparator(getter2Comparator(x => x.ship.stype)),
      composeComparator(
        getter2Comparator(x => x.ship.sortNo),
        composeComparator(
          flipComparator(getter2Comparator(x => x.ship.level)),
          getter2Comparator(x => x.ship.rstId))))

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
  const comparatorResolved = composeComparator(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.
  const doReverse = reversed ? xs => [...xs].reverse() : identity

  return xs => doReverse(xs.sort(comparatorResolved))
}

// a list containing ship leveling goals
class GoalList extends Component {
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
      <div>
        <GoalSorterRow
            sorter={goalSorter}
            onModifySorter={this.handleModifySorter}
            />
        <ListGroup className="goal-list">
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

export { GoalList }
