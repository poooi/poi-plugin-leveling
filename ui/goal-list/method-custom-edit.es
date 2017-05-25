import React, { Component } from 'react'
import { Button, Checkbox, FormControl } from 'react-bootstrap'

import { saturate } from '../../utils'
import { ExpValueEdit } from './exp-value-edit'

class MethodCustomEdit extends Component {
  handleValueChange = newValue => {
    this.props.onCustomInputChange(newValue)
  }
  render() {
    const { visible, customInput } = this.props
    return (
      <div className="custom-edit" style={{display: visible ? "initial" : "none"}}>
        <ExpValueEdit
            expValue={customInput}
            onValueChange={this.handleValueChange}
        />
      </div>
    )
  }
}

export { MethodCustomEdit }
