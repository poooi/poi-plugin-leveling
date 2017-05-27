import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ShipPicker } from './ship-picker'
import { GoalList } from './goal-list'

import { mapDispatchToProps } from '../../reducer'
import {
  recommendedGoalsSelector,
  levelingConfigSelector,
} from '../../selector'

import { PTyp } from '../../ptyp'

const GoalListInst = connect(
  state => ({
    ...recommendedGoalsSelector(state),
    ...levelingConfigSelector(state),
  }),
  mapDispatchToProps,
)(GoalList)

class GoalArea extends Component {
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

export { GoalArea }
