import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import { ThreeRows } from './three-rows'
import { MethodView } from './method-view'

import { PTyp } from '../../../ptyp'

const { FontAwesome } = window

class GoalBoxView extends Component {
  static propTypes = {
    eGoalPair: PTyp.EGoalPair.isRequired,
    editing: PTyp.bool.isRequired,

    onFinishEdit: PTyp.func.isRequired,
    onStartEdit: PTyp.func.isRequired,
  }
  render() {
    const { eGoalPair, onStartEdit, onFinishEdit, editing } = this.props
    const { ship, goal, extra } = eGoalPair
    const { method } = goal

    const remainingExp = extra.remainingExp
    const goalAchieved = remainingExp <= 0
    const remainingExpText = goalAchieved
      ? "+Exp. 0"
      : `+Exp. ${remainingExp}`

    const computeResultText = () => {
      const remainingBattles = extra.remainingBattles
      return remainingBattles.length === 1
        ? String(remainingBattles[0])
        : `${remainingBattles[0]} ~ ${remainingBattles[1]}`
    }

    return (
      <div className="goal-box-view" style={{display: "flex", alignItems: "center"}}>
        <ThreeRows
            style={{flex: 3}}
            first={ship.typeName}
            second={ship.name}
            third={`Id: ${ship.rstId}`}
        />
        <ThreeRows
            style={{flex: 2}}
            first="Level"
            second={ship.level}
            third={`Next: ${ship.expToNext}`}
        />
        <ThreeRows
            style={{flex: 2}}
            first="Goal"
            second={goal.goalLevel}
            third={remainingExpText}
        />
        <MethodView
            style={{flex: 5}}
            method={method}
            />
        <ThreeRows
            style={{flex: 3}}
            first="Result"
            second={goalAchieved ? "-" : computeResultText()}
            third="Battles"
        />
        <div style={{width: "8%", display: "flex", flexDirection: "column"}}>
          <Button onClick={editing ? onFinishEdit : onStartEdit} >
            <FontAwesome name={editing ? "undo" : "pencil"} />
          </Button>
        </div>
      </div>
    )
  }
}

export { GoalBoxView }
