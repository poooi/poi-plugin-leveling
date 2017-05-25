import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'

import { store, extendReducer } from 'views/create-store'
import { mainUISelector } from '../selector'

import { ShipPicker } from './ship-picker'
import { GoalList } from './goal-list'
import { reducer, mapDispatchToProps } from '../reducer'

const { $ } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

class Main extends Component {
  componentWillMount() {
    const { onInitialize, admiralId } = this.props
    onInitialize(admiralId)
  }

  render() {
    return (
      <div>
        <GoalList
            onModifyGoalTable={this.props.onModifyGoalTable}
            goalPairs={this.props.goalPairs} />
        <ShipPicker
            onModifyGoalTable={this.props.onModifyGoalTable}
            ships={this.props.ships} />
      </div>
    )
  }
}

const MainInst = connect(
  mainUISelector,
  mapDispatchToProps,
)(Main)

extendReducer('poi-plugin-leveling', reducer)

ReactDOM.render(
  <Provider store={store}>
    <MainInst />
  </Provider>,
  $("#content-root"))
