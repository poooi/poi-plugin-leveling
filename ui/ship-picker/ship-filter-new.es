import React, { PureComponent } from 'react'

class ShipFilterNew extends PureComponent {
  render() {
    return (
      <div
        style={{marginBottom: 5}}
      >
        <div>Placeholder: stype</div>
        <div>Placeholder: level</div>
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
