import React, { Component } from 'react'
import { Checkbox, FormControl } from 'react-bootstrap'

import { clamp } from 'subtender'
import { PTyp } from '../../ptyp'

const { __ } = window

// note that this component does not guarantee to always return valid ExpValue
class ExpValueEdit extends Component {
  static propTypes = {
    expValue: PTyp.ExpValue.isRequired,
    onValueChange: PTyp.func.isRequired,
  }

  isRanged = () =>
    this.props.expValue.type === 'range'

  handleRangeToggle = () => {
    const { onValueChange } = this.props
    if (this.isRanged()) {
      // switching to a single value, taking "min" as the value
      onValueChange({
        type: 'single',
        value: this.props.expValue.min,
      })
    } else {
      // switching to a ranged value, expanding "value" to both "min" and "max"
      onValueChange({
        type: 'range',
        min: this.props.expValue.value,
        max: this.props.expValue.value,
      })
    }
  }

  handleFirstValueChange = e => {
    const { onValueChange } = this.props
    if (this.isRanged()) {
      onValueChange({
        ...this.props.expValue,
        min: Math.floor(clamp(0,9999)(e.target.value)),
      })
    } else {
      onValueChange({
        ...this.props.expValue,
        value: Math.floor(clamp(0,9999)(e.target.value)),
      })
    }
  }

  handleSecondValueChange = e => {
    const { onValueChange } = this.props
    if (this.isRanged()) {
      onValueChange({
        ...this.props.expValue,
        max: Math.floor(
          clamp(0,9999)(e.target.value)),
      })
    }
  }

  render() {
    const isRanged = this.isRanged()
    return (
      <div
        style={{
          display: 'flex',
          paddingLeft: 5,
          paddingRight: 5,
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Checkbox
          onChange={this.handleRangeToggle}
          checked={isRanged}>{__('EditMethod.Ranged')}
        </Checkbox>
        <FormControl
          style={{flex: 1, marginLeft: '.4em'}}
          type="number"
          onChange={this.handleFirstValueChange}
          value={
            isRanged ? this.props.expValue.min : this.props.expValue.value
          }
        />
        <span
          style={{marginLeft: '.4em', marginRight: '.4em'}}
        >
          ~
        </span>
        <FormControl
          style={{flex: 1}}
          type="number"
          readOnly={!isRanged}
          onChange={this.handleSecondValueChange}
          value={
            isRanged ? this.props.expValue.max : this.props.expValue.value
          }
        />
      </div>
    )
  }
}

export { ExpValueEdit }
