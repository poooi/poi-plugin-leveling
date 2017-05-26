import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import { ThreeRows } from './three-rows'
import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'

import { PTyp } from '../../ptyp'

const { _, FontAwesome } = window

class GoalBoxView extends Component {
  static propTypes = {
    ship: PTyp.Ship.isRequired,
    goal: PTyp.Goal.isRequired,
    editing: PTyp.bool.isRequired,

    onFinishEdit: PTyp.func.isRequired,
    onStartEdit: PTyp.func.isRequired,
  }
  render() {
    const { ship, goal, onStartEdit, onFinishEdit, editing } = this.props

    const [methodSecond, methodThird] = (() => {
      const { method } = goal
      const showExpValue = expValue =>
        expValue.type === "single"
        ? `${expValue.value}`
        : `${expValue.min} ~ ${expValue.max}`
      if (method.type === 'sortie') {
        const { baseExp } = method
        const secondRow =
            baseExp.type === "standard" ? `Sortie ${baseExp.map}`
          : baseExp.type === "custom" ? `Base Exp: ${showExpValue(baseExp.value)}`
          : (console.error("unknown baseExp type",baseExp.type) || "?")

        const strFS =
            method.flagship === "yes" ? "✓"
          : method.flagship === "no" ? "❌"
          : method.flagship === "maybe" ? "✓/❌"
          : (console.error("unknown flagship value",method.flagship) || "?")

        const strMVP =
            method.mvp === "yes" ? "✓"
          : method.mvp === "no" ? "❌"
          : method.mvp === "maybe" ? "✓/❌"
          : (console.error("unknown MVP value",method.mvp) || "?")
        const strRank = method.rank.join("/")
        const thirdRow = `Flagship: ${strFS} MVP: ${strMVP} Rank: ${strRank}`
        return [secondRow, thirdRow]
      }

      // otherwise method.type === custom
      return [`${showExpValue(method.exp)} Exp/sortie`,""]
    })()

    const remainingExp = totalExp(goal.goalLevel) - ship.totalExp
    const goalAchieved = remainingExp <= 0
    const remainingExpText = goalAchieved
      ? "+Exp. 0"
      : `+Exp. ${remainingExp}`

    const computeResultText = () => {
      const expRange = computeExpRange(goal.method)
      const remainingSorties =
        _.uniq(expRange.map( exp => Math.ceil(remainingExp / exp)))
      return remainingSorties.length === 1
        ? String(remainingSorties[0])
        : `${remainingSorties[1]} ~ ${remainingSorties[0]}`
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
        <ThreeRows
            style={{flex: 5}}
            first="Method"
            second={methodSecond}
            third={methodThird}
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
