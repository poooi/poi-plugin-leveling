import React, { PureComponent } from 'react'

import {
  Button,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

const { FontAwesome } = window

class UpOrDownButton extends PureComponent {
  static propTypes = {
    action: PTyp.func,
    dir: PTyp.oneOf(['up','down']).isRequired,
  }

  static defaultProps = {
    action: null,
  }

  render() {
    const { action, dir } = this.props
    return (
      <Button
          disabled={typeof action !== 'function'}
          onClick={action}
          style={{flex: 1}} >
        <FontAwesome name={`angle-${dir}`} />
      </Button>
    )
  }
}

export { UpOrDownButton }
