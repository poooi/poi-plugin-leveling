import React from 'react'
import { ShipList } from './ship-list'
import { ShipFilterNew } from './ship-filter-new'

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
const ShipPicker = _props => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <ShipFilterNew />
    <ShipList />
  </div>
)

export { ShipPicker }
