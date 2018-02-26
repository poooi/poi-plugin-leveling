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
          <div style={{marginRight: '1em'}}>Level</div>
          <ToggleButtonGroup type="radio" name="level" defaultValue="all">
            <ToggleButton
              style={{marginTop: 0}}
              value="all">
              {__('Filter.All')}
            </ToggleButton>
            <ToggleButton
              style={{marginTop: 0}}
              value="ge-100">
              Lv. ≥ 100
            </ToggleButton>
            <ToggleButton
              style={{marginTop: 0}}
              value="lt-99">
              {"Lv. < 99"}
            </ToggleButton>
            <ToggleButton
              style={{marginTop: 0}}
              value="under-final">
              {__('Filter.UnderFinalRemodelLevel')}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div
          style={{display: 'flex'}}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{marginRight: '1em'}}>Fleet</div>
            <ToggleButtonGroup type="radio" name="fleet" defaultValue="all">
              <ToggleButton
                style={{marginTop: 0}}
                value="all">
                {__('Filter.All')}
              </ToggleButton>
              {
                [1,2,3,4].map(fleetId => (
                  <ToggleButton
                    key={fleetId}
                    style={{marginTop: 0}}
                    value={fleetId}>
                    {fleetId}
                  </ToggleButton>
                ))
              }
            </ToggleButtonGroup>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{marginRight: '1em'}}>Lock</div>
            <ToggleButtonGroup type="radio" name="lock" defaultValue="all">
              <ToggleButton
                style={{marginTop: 0}}
                value="all">
                {__('Filter.All')}
              </ToggleButton>
              <ToggleButton
                style={{marginTop: 0}}
                value={true}>
                Locked
              </ToggleButton>
              <ToggleButton
                style={{marginTop: 0}}
                value={false}>
                Unlocked
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

        </div>
      </div>
    )
  }
}

export { ShipFilterNew }
