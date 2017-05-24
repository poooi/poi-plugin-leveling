import React, { Component } from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'

import { ThreeRows } from './three-rows'

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
              third="+Exp. 4470000"
              />
          <ThreeRows
              style={{flex: 5}}
              first="Method"
              second={methodSecond}
              third={methodThird}
              />
          {
            /*
               Method column 3 rows:
               - standard mode: Method, Sortie: 3-2, FS+MVP+Rank
               - custom sortie mode: Method, Sortie: xxx~yyy base exp, FS+MVP+Rank
               - custom exp mode: Custom: xxx~yyy exp, <empty>
             */

          }
          <ThreeRows
              style={{flex: 3}}
              first="Result"
              second="114 ~ 514"
              third="Battles"
              />
          <div style={{width: "8%", display: "flex", flexDirection: "column"}}>
            <Button>Edit</Button>
          </div>
        </div>
      </ListGroupItem>
    )
  }
}

export { GoalBox }
