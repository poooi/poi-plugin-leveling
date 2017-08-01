import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { TemplateList } from '../../../structs'
import { ShipListRow } from './ship-list-row'

const { __ } = window

// this part allows picking ships for leveling
// would include some filters in header and a table
// for showing ship-related info in detail
class ShipList extends Component {
  static defineSortableHeader =
    (name, method, asc = true /* whether it's ascending by default */) => ({
      name, method, asc,
    })

  static headerSpecs = [
    ShipList.defineSortableHeader(__('Sorter.ID'),'rid'),
    ShipList.defineSortableHeader(__('Sorter.Type'),'stype'),
    ShipList.defineSortableHeader(__('Sorter.Name'),'name'),
    ShipList.defineSortableHeader(__('Sorter.Level'),'level',false),
    ShipList.defineSortableHeader(__('Sorter.Evasion'), 'evasion'),
    ShipList.defineSortableHeader(__('Sorter.ASW'),'asw'),
    ShipList.defineSortableHeader(__('Sorter.LoS'),'los'),
    ShipList.defineSortableHeader(__('Sorter.Fleet'),'fleet'),
    ShipList.defineSortableHeader(__('Sorter.Lock'),'lock'),
    // unsortable header don't have method and asc fields
    { name: __('Sorter.Control') },
  ]

  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    sorter: PTyp.ShipPickerSorter.isRequired,
    templates: PTyp.arrayOf(PTyp.Template).isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
    onModifySorter: PTyp.func.isRequired,
  }

  handleAddToGoalTable = ship => () => {
    const { onModifyGoalTable, templates } = this.props
    const { rstId, stype } = ship
    const goalLevel =
        ship.nextRemodelLevel !== null ? ship.nextRemodelLevel
      : ship.level < 99 ? 99
      : 165

    const method = TemplateList.findMethod(templates,false)(stype)

    onModifyGoalTable( gt => {
      const newGoal = {
        rosterId: rstId,
        goalLevel,
        method,
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
          {
            ships.map(ship => (
              <ShipListRow
                  key={ship.rstId}
                  ship={ship}
                  onAddToGoalTable={this.handleAddToGoalTable(ship)}
              />
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export { ShipList }
