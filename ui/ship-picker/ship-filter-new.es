import React, { PureComponent } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

class ShipFilterNew extends PureComponent {
  renderLabelToggleGroups = ({
    label, labelText,
    style, values, renderValueToggle,
  }) => (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        ...style,
      }}>
      <div style={{marginRight: '1em'}}>{labelText}</div>
      <ToggleButtonGroup type="radio" name={label} defaultValue="all">
        {
          values.map(value => (
            <ToggleButton
              style={{marginTop: 0}}
              value={value}>
              {renderValueToggle(value)}
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>
    </div>
  )

  render() {
    const {__} = window
    return (
      <div
        style={{marginBottom: 5, marginLeft: 5}}
      >
        <div>Placeholder: stype</div>
        {
          this.renderLabelToggleGroups({
            label: 'level', labelText: 'Level', style: {marginBottom: 5},
            values: ['all', 'ge-100', 'lt-99', 'under-final'],
            renderValueToggle: value => (
              value === 'all' ? __('Filter.All') :
              value === 'ge-100' ? 'Lv. ≥ 100' :
              value === 'lt-99' ? 'Lv. < 99' :
              value === 'under-final' ? __('Filter.UnderFinalRemodelLevel') :
              '???'
            ),
          })
        }
        <div
          style={{display: 'flex'}}
        >
          {
            this.renderLabelToggleGroups({
              label: 'fleet', labelText: 'Fleet', style: {},
              values: ['all', 1, 2, 3, 4],
              renderValueToggle: value => (
                value === 'all' ? __('Filter.All') : value
              ),
            })
          }
          {
            this.renderLabelToggleGroups({
              label: 'lock', labelText: 'Lock', style: {marginLeft: 10},
              values: ['all', true, false],
              renderValueToggle: value => (
                value === 'all' ? __('Filter.All') :
                typeof value === 'boolean' ? (
                  <FontAwesome name={value ? 'lock' : 'unlock'} />
                ) : '???'
              ),
            })
          }
        </div>
      </div>
    )
  }
}

export { ShipFilterNew }
