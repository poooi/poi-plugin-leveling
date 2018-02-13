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
   - derive more data with selectors
   - "Ships" lists all ships including those that have goals
     - confirm removal (if accidental flag has timed out)
   - improve UI.

   - TODO: mstId-specific templates
   - Tab "Misc"
     - settings (toggle ship avatar)
     - exp table
   - allow applying template even if ship type mismatches
   - allow cloning goal settings
   - save current goal setting as template
   - template can have names
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
