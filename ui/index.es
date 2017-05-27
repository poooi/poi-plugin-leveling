import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'

import { ShipPicker } from './ship-picker'
import { GoalList } from './goal-list'

import { reducer, mapDispatchToProps } from '../reducer'
import {
  mainUISelector,
  recommendedGoalsSelector,
  levelingConfigSelector,
} from '../selector'

import { PTyp } from '../ptyp'

const { $ } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

const GoalListInst = connect(
  state => ({
    ...recommendedGoalsSelector(state),
    ...levelingConfigSelector(state),
  }),
  mapDispatchToProps,
)(GoalList)

class Main extends Component {
  static propTypes = {
    // admiral Id, could be null during initialization
    admiralId: PTyp.number,
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,

    // onInitialize(<admiralId>) call to initialize admirial id and load goalTable
    onInitialize: PTyp.func.isRequired,
    // onModifyGoalTable(<modifier>) where modifier :: GoalTable -> GoalTable
    onModifyGoalTable: PTyp.func.isRequired,
  }

  static defaultProps = {
    admiralId: null,
  }

  componentWillMount() {
    const { onInitialize, admiralId } = this.props
    onInitialize(admiralId)
  }

  render() {
    return (
      <div>
        <GoalListInst
            onModifyGoalTable={this.props.onModifyGoalTable}
            goalPairs={this.props.goalPairs} />
        <ShipPicker
            onModifyGoalTable={this.props.onModifyGoalTable}
            stypeInfo={this.props.stypeInfo}
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
