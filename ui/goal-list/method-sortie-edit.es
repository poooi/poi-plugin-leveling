import React, { Component } from 'react'

class MethodSortieEdit extends Component {
  render() {
    const { visible } = this.props
    return (
      <div style={{display: visible ? "initial" : "none"}}>
        Method Sortie Edit placeholder
      </div>
    )
  }
}

export { MethodSortieEdit }
