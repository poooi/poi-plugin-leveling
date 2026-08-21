import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'

import { GoalBox } from './goal-box'
// import { GoalBoxNew } from './goal-box-new'
import { GoalSorterRow } from './goal-sorter-row'
import {
  extendedGoalPairsSelector,
  recommendedGoalsSelector,
} from './selectors'

class GoalAreaImpl extends Component {
  static propTypes = {
    rmdGoals: PTyp.objectOf(PTyp.arrayOf(PTyp.RGoalLevel)).isRequired,
    eGoalPairs: PTyp.array.isRequired,
    modifyGoalTable: PTyp.func.isRequired,
  }

  render() {
    const {modifyGoalTable, rmdGoals, eGoalPairs} = this.props
    return (
      <div
        style={{height: '100%'}}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <GoalSorterRow />
          <div
            style={{
              height: 0,
              flex: 1,
              overflowY: 'auto',
              marginBottom: 10,
            }}
          >
            {
              eGoalPairs.map(eGoalPair => {
                const {ship} = eGoalPair
                return (
                  <GoalBox
                    modifyGoalTable={modifyGoalTable}
                    key={ship.rstId}
                    rGoals={rmdGoals[ship.rstId]}
                    eGoalPair={eGoalPair}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const GoalArea = connect(
  createStructuredSelector({
    rmdGoals: recommendedGoalsSelector,
    eGoalPairs: extendedGoalPairsSelector,
  }),
  mapDispatchToProps,
)(GoalAreaImpl)

export { GoalArea }
