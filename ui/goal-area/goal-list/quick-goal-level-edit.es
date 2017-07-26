import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { Reason } from '../../../structs'

const { __ } = window

const interpReason = Reason.destruct({
  remodel: (name,typeName) =>
    __('EditLevel.Remodel',`${name} (${typeName})`),
  maxUnmarried: () =>
    __('EditLevel.MaxUnmarried'),
  maxMarried: () =>
    __('EditLevel.MaxMarried'),
})

class QuickGoalLevelEdit extends Component {
  static propTypes = {
    rGoals: PTyp.arrayOf(PTyp.RGoalLevel).isRequired,
    goalLevel: PTyp.number.isRequired,
    onRGoalLevelClick: PTyp.func.isRequired,
  }

  render() {
    const { rGoals, goalLevel, onRGoalLevelClick } = this.props
    return (
      <ListGroup className="rgoal-list">
        {
          rGoals.map( rGoal => (
            <ListGroupItem
                key={`${rGoal.goalLevel}-${rGoal.reason.type}`}>
              <div className="qg-item">
                <div style={{flex: 5}}>Lv. {rGoal.goalLevel}</div>
                <Button
                    title={interpReason(rGoal.reason)}
                    style={{flex: 2}}
                    onClick={onRGoalLevelClick(rGoal.goalLevel)}
                >
                  <FontAwesome
                      name={
                        rGoal.goalLevel === goalLevel
                          ? "dot-circle-o"
                          : "circle-o"
                           }
                  />
                </Button>
              </div>
            </ListGroupItem>))
        }
      </ListGroup>)
  }
}


export { QuickGoalLevelEdit }
