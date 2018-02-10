import { createSelector, createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'
import { Tab, Nav, NavItem } from 'react-bootstrap'
import { modifyObject } from 'subtender'

import { reducer, boundActionCreators as bac, mapDispatchToProps } from '../store'

import { migrate } from '../migrate'
import { loadPState } from '../p-state'

import {
  admiralIdSelector,
  uiSelector,
} from '../selectors'

import { GoalArea } from './goal-area'
import { ShipPicker } from './ship-picker'
import { MethodTemplateArea } from './method-template-area'
import { globalSubscribe, globalUnsubscribe } from '../observers'
import { PTyp } from '../ptyp'

const { $, __, getStore } = window

extendReducer('poi-plugin-leveling', reducer)
globalSubscribe()

const handleWindowUnload = () => {
  window.removeEventListener('unload', handleWindowUnload)
  globalUnsubscribe()
}

window.addEventListener('unload', handleWindowUnload)

/*
   TODO

   - note that ships can be identified by rosterId, but templates aren't,
     we might give it an id to make things easier
   - use template id on UI
   - recover UI functions
      - template page
   - saving mechamism
   - do Tabs properly
   - minimum width
   - scollbar inside content
   - derive more data with selectors
   - Separate "Goals" to "Goals" and "Ships":

     - "Ships" lists all ships including those that have goals
     - improve UI.

   - TODO: mstId-specific templates
   - Tab "Misc"
     - User Manual
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

class LevelingMainImpl extends Component {
  static propTypes = {
    activeTab: PTyp.string.isRequired,
    uiModify: PTyp.func.isRequired,
  }

  handleTabSwitch = activeTab =>
    this.props.uiModify(modifyObject('activeTab', () => activeTab))

  render() {
    const {activeTab} = this.props
    return (
      <Tab.Container
        id="leveling-main"
        onSelect={this.handleTabSwitch}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        activeKey={activeTab}
      >
        <div>
          <div style={{marginBottom: 8}}>
            <Nav
              bsStyle="tabs"
            >
              <NavItem eventKey="goal">
                {__('Top.Goals')}
              </NavItem>
              <NavItem eventKey="ship">
                Ships
              </NavItem>
              <NavItem eventKey="template">
                {__('Top.Templates')}
              </NavItem>
            </Nav>
          </div>
          <div style={{flex: 1, height: 0}}>
            <Tab.Content
              animation={false}
              style={{height: '100%'}}
            >
              <Tab.Pane eventKey="goal" style={{height: '100%'}}>
                <GoalArea />
              </Tab.Pane>
              <Tab.Pane eventKey="ship" style={{height: '100%'}}>
                <ShipPicker />
              </Tab.Pane>
              <Tab.Pane eventKey="template" style={{height: '100%'}}>
                <MethodTemplateArea />
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    )
  }
}

const LevelingMain = connect(
  createStructuredSelector({
    activeTab: createSelector(uiSelector, ui => ui.activeTab),
  }),
  mapDispatchToProps,
)(LevelingMainImpl)

ReactDOM.render(
  <Provider store={store}>
    <div
      style={{margin: "0 1%", minWidth: 600}}
    >
      <LevelingMain />
    </div>
  </Provider>,
  $('#content-root')
)
