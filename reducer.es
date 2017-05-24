import {
  loadGoalTable,
  saveGoalTable,
} from './goal-table'

const initState = {
  admiralId: null,
  goalTable: null,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-leveling@Init') {
    const { admiralId } = action
    const { goalTable } = loadGoalTable(admiralId)

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
})

export {
  reducer,
  mapDispatchToProps,
}
