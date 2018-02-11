import _ from 'lodash'
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'

import {
  pReadySelector,
} from '../selectors'
import { pStateSelector, savePState } from '../p-state'

const debouncedSavePState = _.debounce(
  pState => setTimeout(() => savePState(pState)),
  500
)

const pStateSaver = observer(
  createStructuredSelector({
    ready: pReadySelector,
    pState: pStateSelector,
  }),
  (_dispatch, cur, prev) => {
    if (!cur.ready || !prev.ready)
      return
    if (cur.pState !== prev.pState) {
      debouncedSavePState(cur.pState)
    }
  }
)

export { pStateSaver }
