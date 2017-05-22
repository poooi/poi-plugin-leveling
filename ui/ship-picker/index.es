import React, { Component } from 'react'

import { ShipList } from './ship-list'
import { ShipFilter } from './ship-filter'

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPicker extends Component {
  render() {
    return (
      <div>
        <ShipFilter />
        <ShipList ships={this.props.ships} />
      </div>
    )
  }
}

export { ShipPicker }
