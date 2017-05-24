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
      <div className="three-rows" style={style}>
        <div className="first-row">{first}</div>
        <div className="second-row">{second}</div>
        <div className="third-row">{third}</div>
      </div>
    )
  }
}

export { ThreeRows }
