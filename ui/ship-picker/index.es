import { modifyObject } from 'subtender'
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
  uiSelector,
  goalTableSelector,
  shipsInfoSelector,
  shipTypeInfoSelector,
} from '../../selectors'

import { mapDispatchToProps } from '../../store'

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPickerImpl extends PureComponent {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    uiModify: PTyp.func.isRequired,
    shipTab: PTyp.object.isRequired,
  }

  modifyShipTab = modifier =>
    this.props.uiModify(
      modifyObject('shipTab', modifier)
    )

  handleModifyFilters = modifier =>
    this.modifyShipTab(
      modifyObject('filters', modifier)
    )

  handleModifySorter = modifier =>
    this.modifyShipTab(
      modifyObject('sortMethod', modifier)
    )

  render() {
    const {shipTab: {filters, sortMethod}} = this.props
    const filter = prepareFilter(filters)
    const sorter = prepareSorter(sortMethod)

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
          filters={filters}
          stypeInfo={this.props.stypeInfo}
          stypes={stypes}
        />
        <ShipList
          onModifySorter={this.handleModifySorter}
          sorter={sortMethod}
          ships={ships}
        />
      </div>
    )
  }
}

const ShipPicker = connect(
  createStructuredSelector({
    shipTab: createSelector(uiSelector, ui => ui.shipTab),
    ships: createSelector(
      shipsInfoSelector,
      goalTableSelector,
      (ships, gt) => ships.filter(s => !(s.rstId in gt))
    ),
    stypeInfo: shipTypeInfoSelector,
  }),
  mapDispatchToProps
)(ShipPickerImpl)

export { ShipPicker }
