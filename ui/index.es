import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'
import { Nav, NavItem } from 'react-bootstrap'

// import { reducer, mapDispatchToProps } from '../reducer'
import { reducer, boundActionCreators as bac } from '../store'

import { migrate } from '../migrate'
import { loadPState } from '../p-state'

import {
  goalAreaUISelector,
  methodTemplateUISelector,
  admiralIdSelector,
} from '../selectors'

import { GoalArea } from './goal-area'
import { MethodTemplateArea } from './method-template-area'
import { globalSubscribe, globalUnsubscribe } from '../observers'

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

   - update config -> p-state, together with goal-table updates
   - note that ships can be identified by rosterId, but templates aren't,
     we might give it an id to make things easier

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

const GoalAreaInst = connect(
  goalAreaUISelector,
  // mapDispatchToProps,
)(GoalArea)

const MethodTemplateAreaInst = connect(
  methodTemplateUISelector,
  // mapDispatchToProps,
)(MethodTemplateArea)

class LevelingMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: "goal",
    }
  }

  handleTabSwitch = activeTab =>
    this.setState({ activeTab })

  render() {
    const { activeTab } = this.state
    return (
      <div className="leveling-main">
        <Nav
          bsStyle="tabs"
          activeKey={activeTab}
          onSelect={this.handleTabSwitch}
          justified className="main-nav">
          <NavItem eventKey="goal">{__('Top.Goals')}</NavItem>
          <NavItem eventKey="template">{__('Top.Templates')}</NavItem>
        </Nav>
        <GoalAreaInst visible={activeTab === 'goal'} />
        <MethodTemplateAreaInst visible={activeTab === 'template'} />
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <LevelingMain />
  </Provider>,
  $('#content-root')
)
