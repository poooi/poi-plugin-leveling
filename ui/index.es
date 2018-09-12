// TODO import 'react-virtualized/styles.css'
import React from 'react'
import { join } from 'path-extra'
// import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import { store, extendReducer } from 'views/create-store'

// import { reducer, boundActionCreators as bac } from '../store'
// import { migrate } from '../migrate'
// import { loadPState } from '../p-state'

/*
import {
  admiralIdSelector,
} from '../selectors'
*/

import { Leveling } from './leveling'
// import { globalSubscribe, globalUnsubscribe } from '../observers'

// const { $, getStore } = window

// extendReducer('poi-plugin-leveling', reducer)
// globalSubscribe()

/*
const handleWindowUnload = () => {
  window.removeEventListener('unload', handleWindowUnload)
  globalUnsubscribe()
}

window.addEventListener('unload', handleWindowUnload)
*/

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
 */

// <link rel="stylesheet" id="bootstrap-css" />

const LevelingRoot = _props => (
  <div
    style={{margin: "0 1%", minWidth: 600}}
    className="leveling-root"
    id="leveing-root"
  >
    <link
      rel="stylesheet"
      href={require.resolve('font-awesome/css/font-awesome.css')}
    />
    <link
      rel="stylesheet"
      href={require.resolve('react-virtualized/styles.css')}
    />
    <link
      rel="stylesheet"
      href={join(__dirname, '..', 'assets', 'leveling.css')}
    />
    <Leveling />
  </div>
)

export { LevelingRoot }
