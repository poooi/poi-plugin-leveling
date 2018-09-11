import { reducer, boundActionCreators as bac } from './store'
import { migrate } from './migrate'
import { loadPState } from './p-state'
import { LevelingRoot as reactClass } from './ui'
import {
  admiralIdSelector,
} from './selectors'

const { getStore } = window

const windowMode = true

const pluginDidLoad = () => {
  setTimeout(() => {
    // try normalizing plugin dir structure to one used in 2.0.0
    migrate()
    const pStateOrNull = loadPState()
    bac.ready(pStateOrNull)
    const admiralId = admiralIdSelector(getStore())
    if (admiralId) {
      bac.loadGoalTable(admiralId)
    }
  })
}

const pluginWillUnload = () => {
}

export {
  reducer,
  pluginDidLoad,
  pluginWillUnload,
  reactClass,
  windowMode,
}
