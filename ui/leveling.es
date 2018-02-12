import { createSelector, createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'
import { modifyObject } from 'subtender'

import { mapDispatchToProps } from '../store'

import {
  uiSelector,
  themeSelector,
} from '../selectors'

import { GoalArea } from './goal-area'
import { ShipPicker } from './ship-picker'
import { MethodTemplateArea } from './method-template-area'
import { PTyp } from '../ptyp'

const {__} = window

class LevelingImpl extends PureComponent {
  static propTypes = {
    activeTab: PTyp.string.isRequired,
    theme: PTyp.string.isRequired,
    uiModify: PTyp.func.isRequired,
  }

  handleTabSwitch = activeTab =>
    this.props.uiModify(modifyObject('activeTab', () => activeTab))

  render() {
    const {activeTab, theme} = this.props
    return (
      <Tab.Container
        id="leveling-main"
        className={`theme-${theme}`}
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

const Leveling = connect(
  createStructuredSelector({
    activeTab: createSelector(uiSelector, ui => ui.activeTab),
    theme: themeSelector,
  }),
  mapDispatchToProps
)(LevelingImpl)

export { Leveling }
