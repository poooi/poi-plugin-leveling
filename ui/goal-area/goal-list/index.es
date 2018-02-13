import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { totalExp } from '../../../exp'
import { computeExpRange } from '../../../map-exp'

import { GoalBox } from './goal-box'
import { GoalSorterRow } from './goal-sorter-row'

import {
  recommendedGoalsSelector,
  levelingConfigSelector,
} from '../../../selectors'
import { mapDispatchToProps } from '../../../store'

// a list containing ship leveling goals
class GoalListImpl extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    rmdGoals: PTyp.objectOf(PTyp.arrayOf(PTyp.RGoalLevel)).isRequired,
    goalSorter: PTyp.GoalListSorter.isRequired,

    modifyGoalTable: PTyp.func.isRequired,
    onModifyConfig: PTyp.func.isRequired,
  }

  handleModifySorter = modifier => {
    const { onModifyConfig } = this.props
    onModifyConfig( config => ({
      ...config,
      goalSorter: modifier(config.goalSorter),
    }))
  }

  render() {
    const { goalPairs, modifyGoalTable, rmdGoals, goalSorter } = this.props
    const sorter = prepareSorter(goalSorter)
    const eGoalPairs = sorter(goalPairs.map(extendGoalPair))
    return (
    )
  }
}

const GoalList = connect(
  state => ({
    ...recommendedGoalsSelector(state),
    ...levelingConfigSelector(state),
  }),
  mapDispatchToProps,
)(GoalListImpl)

export { GoalList }
