import React, { Component } from 'react'
import {
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const { FontAwesome } = window

const interpReason = reason => {
  if (reason.type === 'remodel')
    return `Possible to remodel to ${reason.name} (${reason.typeName})`
  if (reason.type === 'max-unmarried')
    return 'Maximum level that unmarried ship can reach'
  if (reason.type === 'max-married')
    return 'Maximum level that married ship can reach'

  console.error(`Unknown reason type ${reason.type}`)
}

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
