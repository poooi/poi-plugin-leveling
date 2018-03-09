import 'react-virtualized/styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'

import { reducer, boundActionCreators as bac } from '../store'
import { migrate } from '../migrate'
import { loadPState } from '../p-state'

import {
  admiralIdSelector,
} from '../selectors'

import { Leveling } from './leveling'
import { globalSubscribe, globalUnsubscribe } from '../observers'

const { $, getStore } = window

extendReducer('poi-plugin-leveling', reducer)
globalSubscribe()

const handleWindowUnload = () => {
  window.removeEventListener('unload', handleWindowUnload)
  globalUnsubscribe()
}

window.addEventListener('unload', handleWindowUnload)

/*
   TODO

   - do Tabs properly (leveling method)
   - improve UI.

   - TODO: mstId-specific templates
   - Tab "Misc"
     - settings (toggle ship avatar)
   - allow applying template even if ship type mismatches
   - allow cloning goal settings
   - save current goal setting as template
   - template can have names
   - highlight ship type to indicate the template to be used.
   - setting: OASW threshold for DD/CL/CLT/ etc.
       - 3 slots threshold: 64, 72, etc.
       - 4 slots threshold: ...
   - reduce CSS assets
 */

window.store = store

// start loading process
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

$('#fontawesome-css').setAttribute(
  'href',
  require.resolve('font-awesome/css/font-awesome.css')
)

ReactDOM.render(
  <Provider store={store}>
    <div
      style={{margin: "0 1%", minWidth: 600}}
    >
      <Leveling />
    </div>
  </Provider>,
  $('#content-root')
)
