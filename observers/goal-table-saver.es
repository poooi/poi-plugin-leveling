import _ from 'lodash'
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import {
  goalsReadySelector,
  goalsGoalTableSelector,
  goalsAdmiralIdSelector,
} from '../selectors'
import { saveGoalTable } from '../goal-table'

const debouncedSaveGoalTable = _.debounce(
  (admiralId, goalTable) =>
    setTimeout(() => saveGoalTable(admiralId, goalTable))
)

const goalTableSaver = observer(
  createStructuredSelector({
    ready: goalsReadySelector,
    goalTable: goalsGoalTableSelector,
    admiralId: goalsAdmiralIdSelector,
  }),
  (_dispatch, cur, prev) => {
    if (!cur.ready || !prev.ready)
      return

    if (cur.goalTable !== prev.goalTable) {
      debouncedSaveGoalTable(cur.admiralId, cur.goalTable)
    }
  }
)

export { goalTableSaver }
