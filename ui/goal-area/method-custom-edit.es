import React, { Component } from 'react'

import { ExpValueEdit } from './exp-value-edit'
import { PTyp } from '../../ptyp'

class MethodCustomEdit extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
    customInput: PTyp.ExpValue.isRequired,

    onCustomInputChange: PTyp.func.isRequired,
  }

  handleValueChange = newValue => {
    this.props.onCustomInputChange(newValue)
  }
  render() {
    const { visible, customInput } = this.props
    return (
      <div
        style={{
          display: visible ? 'initial' : 'none',
          height: '100%',
        }}
      >
        <ExpValueEdit
          expValue={customInput}
          onValueChange={this.handleValueChange}
        />
      </div>
    )
  }
}

export { MethodCustomEdit }
