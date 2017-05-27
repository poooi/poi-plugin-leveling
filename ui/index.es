import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'
import { Nav, NavItem } from 'react-bootstrap'

import { reducer, mapDispatchToProps } from '../reducer'
import {
  goalAreaUISelector,
} from '../selector'

import { GoalArea } from './goal-area'

const { $ } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

const GoalAreaInst = connect(
  goalAreaUISelector,
  mapDispatchToProps,
)(GoalArea)

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
          <NavItem eventKey="goal">Goals</NavItem>
          <NavItem eventKey="method">Method Template</NavItem>
        </Nav>
        <GoalAreaInst visible={activeTab === 'goal'} />
      </div>
    )
  }
}

extendReducer('poi-plugin-leveling', reducer)

ReactDOM.render(
  <Provider store={store}>
    <LevelingMain />
  </Provider>,
  $("#content-root"))
