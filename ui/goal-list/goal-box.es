import React, { Component } from 'react'
import { ListGroupItem, Collapse } from 'react-bootstrap'

import { GoalBoxView } from './goal-box-view'
import { GoalBoxEdit } from './goal-box-edit'

import { PTyp } from '../../ptyp'

class GoalBox extends Component {
  static propTypes = {
    ship: PTyp.Ship.isRequired,
    goal: PTyp.Goal.isRequired,
    rGoals: PTyp.arrayOf(PTyp.RGoalLevel).isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
    }
  }

  handleStartEdit = () =>
    this.setState({editing: true})

  handleFinishEdit = () =>
    this.setState({editing: false})

  render() {
    const { ship, goal, rGoals, onModifyGoalTable } = this.props
    return (
      <ListGroupItem className="goal-box">
        <GoalBoxView
            editing={this.state.editing}
            onStartEdit={this.handleStartEdit}
            onFinishEdit={this.handleFinishEdit}
            ship={ship}
            goal={goal}
        />
        <Collapse in={this.state.editing}>
          <div>
            <GoalBoxEdit
                onFinishEdit={this.handleFinishEdit}
                onModifyGoalTable={onModifyGoalTable}
                ship={ship}
                goal={goal}
                rGoals={rGoals}
            />
          </div>
        </Collapse>
      </ListGroupItem>
    )
  }
}

export { GoalBox }
