import {
  loadGoalTable,
  saveGoalTable,
} from './goal-table'

import {
  loadConfig,
  saveConfig,
} from './config'

const makeInitState = () => ({
  admiralId: null,
  goalTable: null,
  config: loadConfig(),
})

const reducer = (state = makeInitState(), action) => {
  if (action.type === '@poi-plugin-leveling@Init') {
    const { admiralId } = action
    const goalTable = loadGoalTable(admiralId)

    return {
      ...state,
      admiralId,
      goalTable,
    }
  }

  if (action.type === '@poi-plugin-leveling@ModifyGoalTable') {
    const { goalTable, admiralId } = state
    const { modifier } = action
    if (goalTable === null) {
      console.error("trying to modify the goal table while it's not available")
      return state
    }
    const newGoalTable = modifier(goalTable)
    saveGoalTable(admiralId,newGoalTable)
    return {
      ...state,
      goalTable: newGoalTable,
    }
  }

  if (action.type === '@poi-plugin-leveling@ModifyConfig') {
    const { config } = state
    const { modifier } = action
    const newConfig = modifier(config)
    saveConfig(newConfig)
    return {
      ...state,
      config: newConfig,
    }
  }


  return state
}

const mapDispatchToProps = dispatch => ({
  onInitialize: admiralId =>
    dispatch({
      type: '@poi-plugin-leveling@Init',
      admiralId,
    }),
  // modifier :: GoalTable -> GoalTable
  // note that modifier modifies an existing GoalTable,
  // which means the structure passing to modifier is always not null
  // and modifier should return a correctly structured GoalTable
  onModifyGoalTable: modifier =>
    dispatch({
      type: '@poi-plugin-leveling@ModifyGoalTable',
      modifier,
    }),
  onModifyConfig: modifier =>
    dispatch({
      type: '@poi-plugin-leveling@ModifyConfig',
      modifier,
    }),
})

export {
  reducer,
  mapDispatchToProps,
}
