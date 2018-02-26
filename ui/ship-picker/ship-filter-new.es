import React, { PureComponent } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

class ShipFilterNew extends PureComponent {
  render() {
    const {__} = window
    return (
      <div
        style={{marginBottom: 5}}
      >
        <div>Placeholder: stype</div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div>Level</div>
          <ToggleButtonGroup type="radio" name="level" defaultValue="all">
            <ToggleButton value="all">
              {__('Filter.All')}
            </ToggleButton>
            <ToggleButton value="ge-100">
              Lv. ≥ 100
            </ToggleButton>
            <ToggleButton value="lt-99">
              {"Lv. < 99"}
            </ToggleButton>
            <ToggleButton value="under-final">
              {__('Filter.UnderFinalRemodelLevel')}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div
          style={{display: 'flex'}}
        >
          <div style={{flex: 3}}>Placeholder: fleet</div>
          <div style={{flex: 2}}>Placeholder: lock</div>
        </div>
      </div>
    )
  }
}

export { ShipFilterNew }
