import React, { Component } from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'

import { ThreeRows } from './three-rows'
import { totalExp } from '../../exp'
import { computeExpRange } from '../../map-exp'

const { _, FontAwesome } = window

class GoalBox extends Component {
  render() {
    const { ship, goal } = this.props

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

        const strFS = method.flagship ? "✓" : "❌"
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
      <ListGroupItem>
        <div className="goal-box" style={{display: "flex", alignItems: "center"}}>
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
            <Button>
              <FontAwesome name="pencil" />
            </Button>
          </div>
        </div>
      </ListGroupItem>
    )
  }
}

export { GoalBox }
