import React, { Component } from 'react'
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const { FontAwesome } = window

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
                <div style={{flex: 3}}>Lv. {rGoal.goalLevel}</div>
                <Button
                    style={{flex: 1}}
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
            </ListGroupItem>
          ))
        }
      </ListGroup>)
  }
}


export { QuickGoalLevelEdit }
