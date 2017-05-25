import React, { Component } from 'react'

import { ShipList } from './ship-list'
import { ShipFilter } from './ship-filter'

import { identity } from '../../utils'

const { _ } = window

const prepareFilter = filters => {
  const { fleet, type, level, lock } = filters
  const mkFilter = pred => ship => ship.filter(pred)

  const fleetFilter =
      fleet === 'all' ? identity
    : (fleet >= 1 && fleet <= 4) ? mkFilter(ship => ship.fleet === fleet)
    : console.error(`Invalid fleet filter: ${fleet}`)

  const typeFilter =
      type === 'all' ? identity
    : typeof type === 'number' ? mkFilter(ship => ship.stype === type)
    : console.error(`Invalid type filter: ${type}`)

  const levelFilter =
      level === 'all' ? identity
    : level === 'ge-100' ? mkFilter(ship => ship.level >= 100)
    : level === 'lt-99' ? mkFilter(ship => ship.level < 99)
    : console.error(`Invalid level filter: ${level}`)

  const lockFilter =
      lock === 'all' ? identity
    : lock === true ? mkFilter(ship => ship.locked)
    : lock === false ? mkFilter(ship => !ship.locked)
    : console.error(`Invalid lock filter: ${lock}`)

  // filter that potentially removes more items than others goes first
  return _.flow([fleetFilter, typeFilter, levelFilter, lockFilter])
}

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: {
        fleet: 'all', // or 1,2,3,4 (number)
        type: 'all', // or stype (number)
        level: 'all', // or 'ge-100', 'lt-99'
        lock: 'all', // or true / false
      },
    }
  }

  handleModifyFilters = modifier => {
    this.setState(state => ({
      ...state,
      filters: modifier(state.filters),
    }))
  }

  render() {
    const filter = prepareFilter(this.state.filters)
    const sorter = xs => [...xs].sort( (x,y) => {
      if (x.level !== y.level)
        return y.level - x.level
      if (x.sortNo !== y.sortNo)
        return x.sortNo - y.sortNo
      if (x.rstId !== y.rstId)
        return x.rstId - y.rstId
      return 0
    })

    const originalShips = this.props.ships
    const stypeSet = new Set()
    originalShips.map( s => {
      stypeSet.add(s.stype)
    })
    const stypes = [...stypeSet].sort((x,y) => x-y)
    const ships = sorter(filter(originalShips))
    return (
      <div>
        <ShipFilter
            onModifyFilters={this.handleModifyFilters}
            filters={this.state.filters}
            stypeInfo={this.props.stypeInfo}
            stypes={stypes} />
        <ShipList
            onModifyGoalTable={this.props.onModifyGoalTable}
            ships={ships} />
      </div>
    )
  }
}

export { ShipPicker }
