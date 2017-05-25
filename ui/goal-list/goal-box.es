import React, { Component } from 'react'
import { ListGroupItem, Button, Collapse } from 'react-bootstrap'

import { GoalBoxView } from './goal-box-view'
import { GoalBoxEdit } from './goal-box-edit'

class GoalBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // TODO: true for debugging
      editing: true,
    }
  }

  handleStartEdit = () =>
    this.setState({editing: true})

  handleCancelEdit = () =>
    this.setState({editing: false})

  render() {
    return (
      <ListGroupItem className="goal-box">
        <GoalBoxView
            editing={this.state.editing}
            onStartEdit={this.handleStartEdit}
            onCancelEdit={this.handleCancelEdit}
            ship={this.props.ship}
            goal={this.props.goal}
        />
        <Collapse in={this.state.editing}>
          <div>
            <GoalBoxEdit
                ship={this.props.ship}
                goal={this.props.goal}
            />
          </div>
        </Collapse>
      </ListGroupItem>
    )
  }
}

export { GoalBox }
