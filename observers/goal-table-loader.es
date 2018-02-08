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
} from '../selectors'

const goalTableLoader = observer(
  createStructuredSelector({
    // whether <extStore> is loaded
    ready: pReadySelector,
    admiralId: admiralIdSelector,
  }),
  (_dispatch, cur, prev) => {
    // ensure that we have a valid current admiral id
    if (!cur.ready || !cur.admiralId)
      return

    // admiral change detection
    if (prev.admiralId !== cur.admiralId) {
      bac.loadGoalTable(cur.admiralId)
    }
  }
)

export { goalTableLoader }
