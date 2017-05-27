import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'
import { PTyp } from '../../../ptyp'

const { FontAwesome } = window
// this part allows picking ships for leveling
// would include some filters in header and a table
// for showing ship-related info in detail
// TODO: ShipList => ShipTableArea after done
class ShipList extends Component {
  static defineSortableHeader =
    (name, method, asc = true /* whether it's ascending by default */) => ({
      name, method, asc,
    })

  static headerSpecs = [
    ShipList.defineSortableHeader('Id','rid'),
    ShipList.defineSortableHeader('Type','stype'),
    ShipList.defineSortableHeader('Name','name'),
    ShipList.defineSortableHeader('Level','level',false),
    ShipList.defineSortableHeader('Evasion', 'evasion'),
    ShipList.defineSortableHeader('ASW','asw'),
    ShipList.defineSortableHeader('LoS','los'),
    ShipList.defineSortableHeader('Fleet','fleet'),
    ShipList.defineSortableHeader('Lock','lock'),
    // unsortable header don't have method and asc fields
    { name: 'Control' },
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

  handleClickHeader = method => () => {
    const { onModifySorter } = this.props
    onModifySorter( sorter => {
      if (sorter.method === method)
        return {
          ...sorter,
          reversed: !sorter.reversed,
        }
      else
        return {
          method,
          reversed: false,
        }
    })
  }

  render() {
    const { ships, sorter } = this.props
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
              ShipList.headerSpecs.map( ({name, method, asc}) => {
                const sortable =
                  typeof method === 'string' &&
                  typeof asc === 'boolean'
                const isActive = sorter.method === method
                // using name instead of method, as some doesn't have the latter
                const key = name
                let content
                if (isActive) {
                  const dir = sorter.reversed ? (asc ? '▼' : '▲') : (asc ? '▲' : '▼')
                  content = `${name} ${dir}`
                } else {
                  content = name
                }

                return (
                  <th
                      className={isActive ? "text-primary" : ""}
                      key={key}
                      onClick={sortable ? this.handleClickHeader(method) : null}>
                    {content}
                  </th>
                )
              })
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
