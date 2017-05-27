import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'
import { PTyp } from '../../ptyp'

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

  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    sorter: PTyp.ShipPickerSorter.isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
    onModifySorter: PTyp.func.isRequired,
  }

  handleAddToGoalTable = ship => () => {
    const { onModifyGoalTable } = this.props
    const { rstId } = ship
    const goalLevel =
        ship.nextRemodelLevel !== null ? ship.nextRemodelLevel
      : ship.level < 99 ? 99
      : 155

    onModifyGoalTable( gt => {
      // TODO: most of the values are placeholders
      const newGoal = {
        rosterId: rstId,
        goalLevel,
        method: {
          type: "sortie",
          flagship: "yes",
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
    const mkRow = ship => (
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
        <td style={{textAlign: "center"}}>
          <Button
              onClick={this.handleAddToGoalTable(ship)}
              style={{width: "80%", height: "18px", padding: "0"}} >+</Button>
        </td>
      </tr>
    )

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
