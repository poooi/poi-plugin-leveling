import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoalList } from './goal-list'

import {
  goalAreaUISelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'

class GoalAreaImpl extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,

    // onInitialize(<admiralId>) call to initialize admirial id and load goalTable
    // onInitialize: PTyp.func.isRequired,
    // onModifyGoalTable(<modifier>) where modifier :: GoalTable -> GoalTable
    onModifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const {
      goalPairs,
      onModifyGoalTable,
    } = this.props
    return (
      <div
        className="goal-area"
        style={{height: '100%'}}
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
