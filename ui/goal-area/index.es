import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ShipPicker } from './ship-picker'
import { GoalList } from './goal-list'

import {
  recommendedGoalsSelector,
  levelingConfigSelector,
  goalAreaUISelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'

class GoalAreaImpl extends Component {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    visible: PTyp.bool.isRequired,
    templates: PTyp.arrayOf(PTyp.Template).isRequired,

    // onInitialize(<admiralId>) call to initialize admirial id and load goalTable
    // onInitialize: PTyp.func.isRequired,
    // onModifyGoalTable(<modifier>) where modifier :: GoalTable -> GoalTable
    onModifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const {
      visible,
      goalPairs,
      stypeInfo,
      ships,
      onModifyGoalTable,
      templates,
    } = this.props
    return (
      <div
        className="goal-area"
        style={{display: visible ? 'initial' : 'none'}}
      >
        <GoalList
          onModifyGoalTable={onModifyGoalTable}
          goalPairs={goalPairs} />
        <ShipPicker
          onModifyGoalTable={onModifyGoalTable}
          stypeInfo={stypeInfo}
          templates={templates}
          ships={ships} />
      </div>
    )
  }
}

const GoalArea = connect(
  goalAreaUISelector,
  // mapDispatchToProps,
)(GoalAreaImpl)

export { GoalArea }
