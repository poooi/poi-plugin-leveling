/*

   this module observes changes to admiralId,
   load and update <extStore>.goals accordingly.

 */
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import { boundActionCreators as bac } from '../store'
import {
  admiralIdSelector,
  pReadySelector,
  goalsReadySelector,
} from '../selectors'

const goalTableLoader = observer(
  createStructuredSelector({
    // whether <extStore> is loaded
    pReady: pReadySelector,
    goalsReady: goalsReadySelector,
    admiralId: admiralIdSelector,
  }),
  (_dispatch, cur, prev) => {
    // goalsReady also ensures that admiralId is valid and correct
    if (!cur.pReady || !cur.goalsReady)
      return

    // admiral change detection
    if (prev.admiralId !== cur.admiralId) {
      bac.loadGoalTable(cur.admiralId)
    }
  }
)

export { goalTableLoader }
