import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoalList } from './goal-list'

import {
  goalAreaUISelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'

class GoalAreaImpl extends Component {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    templates: PTyp.arrayOf(PTyp.Template).isRequired,

    // onInitialize(<admiralId>) call to initialize admirial id and load goalTable
    // onInitialize: PTyp.func.isRequired,
    // onModifyGoalTable(<modifier>) where modifier :: GoalTable -> GoalTable
    onModifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const {
      goalPairs,
      stypeInfo,
      ships,
      onModifyGoalTable,
      templates,
    } = this.props
    return (
      <div
        className="goal-area"
      >
        <GoalList
          onModifyGoalTable={onModifyGoalTable}
          goalPairs={goalPairs} />
      </div>
    )
  }
}

const GoalArea = connect(
  goalAreaUISelector,
  // mapDispatchToProps,
)(GoalAreaImpl)

export { GoalArea }
