import React, { Component } from 'react'
import {
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'

class MethodTemplateArea extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
  }

  render() {
    const { visible } = this.props
    return (
      <div
          className="method-template-area"
          style={{display: visible?'initial':'none'}}
      >
        <ListGroup>
          <ListGroupItem>Test Item</ListGroupItem>
        </ListGroup>
      </div>
    )
  }
}

export { MethodTemplateArea }
