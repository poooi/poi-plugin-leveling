import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ShipList } from './ship-list'
import { ShipFilter } from './ship-filter'

import { PTyp } from '../../ptyp'
import { prepareFilter, prepareSorter } from '../../shiplist-ops'

import {
  goalTableSelector,
  shipsInfoSelector,
  shipTypeInfoSelector,
} from '../../selectors'

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPickerImpl extends PureComponent {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      filters: {
        fleet: 'all', // or 1,2,3,4 (number)
        type: 'all', // or stype (number)
        level: 'all', // or 'ge-100', 'lt-99', 'under-final'
        lock: 'all', // or true / false
      },
      sorter: {
        // every sorting method would have a "natural" order
        // which can either be ascending or descending,
        // we let the sorting method itself to decide which one
        // is more natural, and mark "reversed" as true only when
        // clicking on the same method twice
        // methods (all ascending unless explicitly says otherwise)
        // - rid
        // - stype
        // - name
        // - level, descending
        // - evasion
        // - asw
        // - los
        // - fleet
        // - lock
        method: 'level',
        reversed: false,
      },
    }
  }

  handleModifyFilters = modifier =>
    this.setState(state => ({
      ...state,
      filters: modifier(state.filters),
    }))

  handleModifySorter = modifier =>
    this.setState(state => ({
      ...state,
      sorter: modifier(state.sorter),
    }))

  render() {
    const filter = prepareFilter(this.state.filters)
    const sorter = prepareSorter(this.state.sorter)

    const originalShips = this.props.ships
    const stypeSet = new Set()
    originalShips.map(s => {
      stypeSet.add(s.stype)
    })
    const stypes = [...stypeSet].sort((x,y) => x-y)
    const ships = sorter(filter(originalShips))
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShipFilter
          onModifyFilters={this.handleModifyFilters}
          filters={this.state.filters}
          stypeInfo={this.props.stypeInfo}
          stypes={stypes}
        />
        <ShipList
          onModifySorter={this.handleModifySorter}
          sorter={this.state.sorter}
          ships={ships}
        />
      </div>
    )
  }
}

const ShipPicker = connect(
  createStructuredSelector({
    ships: createSelector(
      shipsInfoSelector,
      goalTableSelector,
      (ships, gt) => ships.filter(s => !(s.rstId in gt))
    ),
    stypeInfo: shipTypeInfoSelector,
  }),
  // goalAreaUISelector,
)(ShipPickerImpl)

export { ShipPicker }
