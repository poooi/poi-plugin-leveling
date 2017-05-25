import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'

import { GoalBox } from './goal-box'

// a list containing ship leveling goals
class GoalList extends Component {
  render() {
    const { goalPairs, onModifyGoalTable } = this.props
    return (
      <ListGroup className="goal-list">
        {
          goalPairs.map(([ship,goal]) => (
            <GoalBox
                onModifyGoalTable={onModifyGoalTable}
                key={ship.rstId} goal={goal} ship={ship} />
          ))
        }
      </ListGroup>
    )
  }
}

export { GoalList }
