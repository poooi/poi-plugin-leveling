import _ from 'lodash'
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../../ptyp'

class ShipListRow extends Component {
  static propTypes = {
    ship: PTyp.Ship.isRequired,
    onAddToGoalTable: PTyp.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    // things to be appeared on UI:
    // - rstId
    // - typeName name (depending on mstId)
    // - evasion asw los (depending on mstId and level)
    // - fleet
    // - locked

    const simplified = props => {
      const { ship } = props
      const { rstId, mstId, level, fleet, locked } = ship
      // we just need to check following part of props
      // hopefully each of them are primitives so there is no deep equal involved
      return {rstId, mstId, level, fleet, locked}
    }

    return ! _.isEqual(simplified(this.props),simplified(nextProps))
  }

  render() {
    const { ship, onAddToGoalTable } = this.props
    return (
      <tr>
        <td>{ship.rstId}</td>
        <td>{ship.typeName}</td>
        <td>{ship.name}</td>
        <td>{ship.level}</td>
        <td>{ship.evasion}</td>
        <td>{ship.asw}</td>
        <td>{ship.los}</td>
        <td className="fleet-id-indicator" style={{textAlign: "center"}}>{ship.fleet}</td>
        <td style={{textAlign: "center"}}>{ship.locked && <FontAwesome name="lock" />}</td>
        <td style={{textAlign: "center"}}>
          <Button
            onClick={onAddToGoalTable}
            style={{width: "80%", height: "18px", padding: "0"}} >
            +
          </Button>
        </td>
      </tr>
    )
  }
}

export { ShipListRow }
