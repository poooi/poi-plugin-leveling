import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

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
          <td>{ship.fleet}</td>
          <td>{""+ship.locked}</td>
          <td>Add</td>
        </tr>
      )
    }
    console.log( ships)
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
