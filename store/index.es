import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { modifyObject } from 'subtender'
import { store } from 'views/create-store'

import { loadGoalTable } from '../goal-table'
import { initState } from './init-state'

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-leveling@ready') {
    const {pState} = action
    return {
      ...state,
      ...pState,
      pReady: true,
    }
  }

  if (!state.pReady)
    return state

  if (action.type === '@poi-plugin-leveling@modify') {
    const {modifier} = action
    return modifier(state)
  }

  return state
}

const actionCreators = {
  ready: pStateOrNull => {
    const templates = _.get(pStateOrNull, 'templates')
    const ui = _.get(pStateOrNull, 'ui')

    const pState = {}
    if (!_.isEmpty(templates))
      pState.templates = templates
    if (!_.isEmpty(ui))
      pState.ui = ui

    return {
      type: '@poi-plugin-leveling@ready',
      pState,
    }
  },
  modify: modifier => ({
    type: '@poi-plugin-leveling@modify',
    modifier,
  }),
  loadGoalTable: admiralId => dispatch =>
    setTimeout(() => {
      const goalTable = loadGoalTable(admiralId)
      const goals = {
        admiralId,
        goalTable,
      }
      dispatch(actionCreators.modify(modifyObject('goals', () => goals)))
    }),
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreators, dispatch))

const boundActionCreators = mapDispatchToProps(store.dispatch)

export * from './init-state'

export {
  reducer,
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
}
