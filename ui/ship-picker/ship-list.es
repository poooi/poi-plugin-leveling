import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { ShipListRow } from './ship-list-row'
import { mapDispatchToProps } from '../../store'

const { __ } = window

const defineSortableHeader =
  (name, method, asc = true /* whether it's ascending by default */) => ({
    name, method, asc,
  })

const headerSpecs = [
  defineSortableHeader(__('Sorter.ID'),'rid'),
  defineSortableHeader(__('Sorter.Type'),'stype'),
  defineSortableHeader(__('Sorter.Name'),'name'),
  defineSortableHeader(__('Sorter.Level'),'level',false),
  defineSortableHeader(__('Sorter.Evasion'), 'evasion'),
  defineSortableHeader(__('Sorter.ASW'),'asw'),
  defineSortableHeader(__('Sorter.LoS'),'los'),
  defineSortableHeader(__('Sorter.Fleet'),'fleet'),
  defineSortableHeader(__('Sorter.Lock'),'lock'),
  // unsortable header don't have method and asc fields
  { name: __('Sorter.Control') },
]

// this part allows picking ships for leveling
// would include some filters in header and a table
// for showing ship-related info in detail
class ShipListImpl extends PureComponent {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    sorter: PTyp.ShipPickerSorter.isRequired,

    onModifySorter: PTyp.func.isRequired,
    addShipToGoalTable: PTyp.func.isRequired,
  }

  handleAddToGoalTable = rstId => () =>
    this.props.addShipToGoalTable(rstId)

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
    const {ships, sorter} = this.props
    return (
      <div
        style={{
          flex: 1,
          height: 0,
          overflowY: 'auto',
        }}
      >
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {
                headerSpecs.map(({name, method, asc}) => {
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
                  onAddToGoalTable={this.handleAddToGoalTable(ship.rstId)}
                />
              ))
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

const ShipList = connect(
  null,
  mapDispatchToProps,
)(ShipListImpl)

export { ShipList }
