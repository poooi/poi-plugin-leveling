import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoalList } from './goal-list'

import {
  goalAreaUISelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'

class GoalAreaImpl extends Component {
  static propTypes = {
    goalPairs: PTyp.arrayOf(PTyp.GoalPair).isRequired,
    goalsModify: PTyp.func.isRequired,
  }

  render() {
    const {
      goalPairs,
      goalsModify,
    } = this.props
    return (
      <div
        className="goal-area"
        style={{height: '100%'}}
      >
        <GoalList
          goalsModify={goalsModify}
          goalPairs={goalPairs}
        />
      </div>
    )
  }
}

const GoalArea = connect(
  goalAreaUISelector,
  mapDispatchToProps,
)(GoalAreaImpl)

export { GoalArea }
