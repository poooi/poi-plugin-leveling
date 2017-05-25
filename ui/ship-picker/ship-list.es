import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'
const { FontAwesome } = window
// this part allows picking ships for leveling
// would include some filters in header and a table
// for showing ship-related info in detail
// TODO: ShipList => ShipTableArea after done
class ShipList extends Component {
  static headers = [
    "Id", "Type", "Name", "Level",
    "Evasion", "ASW", "LoS",
    "Fleet", "Lock", "Control",
  ]


  handleAddToGoalTable = rstId => () => {
    const { onModifyGoalTable } = this.props
    onModifyGoalTable( gt => {
      // TODO: most of the values are placeholders
      const newGoal = {
        rosterId: rstId,
        goalLevel: 155,
        method: {
          type: "sortie",
          flagship: true,
          mvp: "yes",
          rank: ["S","A"],
          baseExp: {
            type: "standard",
            map: "3-2",
          },
        },
      }
      return {...gt, [rstId]: newGoal}
    })
  }

  render() {
    const { ships } = this.props
    const mkRow = ship => {
      return (
        <tr key={ship.rstId}>
          <td>{ship.rstId}</td>
          <td>{ship.typeName}</td>
          <td>{ship.name}</td>
          <td>{ship.level}</td>
          <td>{ship.evasion}</td>
          <td>{ship.asw}</td>
          <td>{ship.los}</td>
          <td className="fleet-id-indicator" style={{textAlign: "center"}}>{ship.fleet}</td>
          <td style={{textAlign: "center"}}>{ship.locked && <FontAwesome name="lock" />}</td>
          <td>
            <Button
                onClick={this.handleAddToGoalTable(ship.rstId)}
                style={{width: "80%", height: "18px", padding: "0"}} >+</Button>
          </td>
        </tr>
      )
    }
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            {
              ShipList.headers.map( x => (<th key={x}>{x}</th>))
            }
          </tr>
        </thead>
        <tbody>
          { ships.map( mkRow ) }
        </tbody>
      </Table>
    )
  }
}

export { ShipList }
