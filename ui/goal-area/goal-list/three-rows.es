import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ThreeRows extends Component {
  static propTypes = {
    style: PropTypes.object,
    first: PropTypes.node.isRequired,
    second: PropTypes.node.isRequired,
    third: PropTypes.node.isRequired,
  }

  static defaultProps = {
    style: {},
  }
  render() {
    const { style, first, second, third } = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}>
        <div
          style={{
            fontSize: 12,
          }}
        >
          {first}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            paddingLeft: 5,
          }}
        >
          {second}
        </div>
        <div
          style={{
            fontSize: 10,
            paddingLeft: 5,
          }}
        >
          {third}
        </div>
      </div>
    )
  }
}

export { ThreeRows }
