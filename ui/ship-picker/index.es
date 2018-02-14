import { modifyObject } from 'subtender'
import {
  createStructuredSelector,
} from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ShipList } from './ship-list'
import { ShipFilter } from './ship-filter'

import { PTyp } from '../../ptyp'

import {
  shipListSelector,
  sortMethodSelector,
} from './selectors'

import { mapDispatchToProps } from '../../store'

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPickerImpl extends PureComponent {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    sortMethod: PTyp.object.isRequired,
    uiModify: PTyp.func.isRequired,
  }

  modifyShipTab = modifier =>
    this.props.uiModify(
      modifyObject('shipTab', modifier)
    )

  handleModifySorter = modifier =>
    this.modifyShipTab(
      modifyObject('sortMethod', modifier)
    )

  render() {
    const {ships, sortMethod} = this.props
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShipFilter />
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
    sortMethod: sortMethodSelector,
    ships: shipListSelector,
  }),
  mapDispatchToProps
)(ShipPickerImpl)

export { ShipPicker }
