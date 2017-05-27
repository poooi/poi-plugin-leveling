import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'

import { GoalBox } from './goal-box'
import { PTyp } from '../../ptyp'

import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'

const { _ } = window

// adding "extra" field, which contains exp-related info, into GoalPair
// we call this structure EGoalPair (E for Extended)
const extendGoalPair = ({ship, goal}) => {
  const remainingExp = Math.max(0,totalExp(goal.goalLevel) - ship.totalExp)
  const expRange = computeExpRange(goal.method)
  const remainingSorties =
    _.uniq(expRange.map( exp => Math.ceil(remainingExp / exp)))
      .reverse() // as division flips the list

  const extra = {
    remainingExp,
    remainingSorties,
  }

  return {
    ship,
    goal,
    extra,
  }
}

// a list containing ship leveling goals
class GoalList extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    rmdGoals: PTyp.objectOf(PTyp.arrayOf(PTyp.RGoalLevel)).isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const { goalPairs, onModifyGoalTable, rmdGoals } = this.props
    const eGoalPairs = goalPairs.map(extendGoalPair)

    return (
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
    )
  }
}

export { GoalList }
