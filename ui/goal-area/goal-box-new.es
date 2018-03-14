import React, { PureComponent } from 'react'

class GoalBoxNew extends PureComponent {
  render() {
    return (
      <div>{JSON.stringify(this.props)}</div>
    )
  }
}

export { GoalBoxNew }
