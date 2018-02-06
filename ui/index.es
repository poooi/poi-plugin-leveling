import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'
import { Nav, NavItem } from 'react-bootstrap'

import { reducer, mapDispatchToProps } from '../reducer'
import {
  goalAreaUISelector,
  methodTemplateUISelector,
} from '../selector'

import { GoalArea } from './goal-area'
import { MethodTemplateArea } from './method-template-area'

const { $, __ } = window

/*
   TODO

   - update config -> p-state, together with goal-table updates
   - note that ships can be identified by rosterId, but templates aren't,
     we might give it an id to make things easier

 */

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

const GoalAreaInst = connect(
  goalAreaUISelector,
  mapDispatchToProps,
)(GoalArea)

const MethodTemplateAreaInst = connect(
  methodTemplateUISelector,
  mapDispatchToProps,
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

extendReducer('poi-plugin-leveling', reducer)

ReactDOM.render(
  <Provider store={store}>
    <LevelingMain />
  </Provider>,
  $('#content-root')
)
