/*

   this module observes changes to admiralId,
   load and update <extStore>.goals accordingly.

 */
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import {
  extensionSelectorFactory,
} from 'views/utils/selectors'
import { boundActionCreators as bac } from '../store'
import { admiralIdSelector } from '../selectors'

// TODO: move to selectors
const extSelector = extensionSelectorFactory('poi-plugin-leveling')
const pReadySelector = createSelector(extSelector, ext => ext.pReady)

const goalTableLoader = observer(
  createStructuredSelector({
    ready: pReadySelector,
    admiralId: admiralIdSelector,
  }),
  (_dispatch, cur, prev) => {
    if (!cur.ready || !cur.admiralId)
      return

    if (prev.admiralId !== cur.admiralId) {
      bac.loadGoalTable(cur.admiralId)
    }
  }
)

export { goalTableLoader }
