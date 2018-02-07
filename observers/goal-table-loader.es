/*

   this module observes changes to admiralId and <extStore>.pReady,
   load and update <extStore>.goals accordingly when:

   - pReady becomes true (which means p-state is now loaded)
   - admiralId changes

 */
import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import {
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'
import { modifyObject } from 'subtender'

import { loadGoalTable } from '../goal-table'
import { boundActionCreators as bac } from '../store'

const extSelector = extensionSelectorFactory('poi-plugin-leveling')

const pReadySelector = createSelector(extSelector, ext => ext.pReady)
const goalsSelector = createSelector(extSelector, ext => ext.goals)
const admiralIdSelector = createSelector(
  basicSelector,
  basic => {
    const raw = _.get(basic, 'api_member_id')
    if (raw) {
      const parsed = Number(raw)
      return _.isInteger(parsed) ? parsed : null
    } else {
      return null
    }
  }
)

const goalTableLoader = observer(
  createStructuredSelector({
    ready: pReadySelector,
    admiralId: admiralIdSelector,
    goalsAdmiralId: createSelector(
      goalsSelector,
      goals => goals.admiralId
    ),
  }),
  (_dispatch, cur, _prev) => {
    const {ready, admiralId, goalsAdmiralId} = cur
    if (!ready || !admiralId)
      return

    if (goalsAdmiralId === null || goalsAdmiralId !== admiralId) {
      setTimeout(() => {
        const goalTable = loadGoalTable(admiralId)
        const goals = {
          admiralId,
          goalTable,
        }

        bac.modify(modifyObject('goals', () => goals))
      })
    }
  }
)

export { goalTableLoader }
