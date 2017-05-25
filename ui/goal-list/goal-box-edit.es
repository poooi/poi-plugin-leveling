import React, { Component } from 'react'
import {
  Panel,
  ListGroupItem,
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  Nav, NavItem,
} from 'react-bootstrap'

import { MethodSortieEdit } from './method-sortie-edit'
import { MethodCustomEdit } from './method-custom-edit'
import { expValueFromBaseExp, computeExpRange } from '../../map-exp'

const { _, FontAwesome } = window

// to generate sensible initial values
// we use one method as a source to guess another
const fillStates = method => {
  if (method.type === 'sortie') {
    const { flagship, mvp, rank, baseExp } = method
    const expRange = computeExpRange(method)
    return {
      sortieInput: {
        flagship,
        mvp,
        rank,
        baseExp,
      },
      customInput:
        expRange.length === 1
        ? { type: 'single', value: expRange[0] }
        : { type: 'range', min: expRange[0], max: expRange[1] },
    }
  }

  if (method.type === 'custom') {
    const sortieInput = {
      flagship: true,
      mvp: 'yes',
      rank: ['S'],
      baseExp: method.exp,
    }
    return {
      sortieInput,
      customInput: method.exp,
    }
  }

  console.error(`Invalid method type: ${method.type}`)
}

const toValidLevel = inp =>
    inp < 1 ? 1
  : inp > 155 ? 155
  : Math.floor(inp)

class GoalBoxEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      goalLevel: props.goal.goalLevel,
      methodType: props.goal.method.type,
      ...fillStates(props.goal.method),
    }
  }

  handleGoalLevelChange = e => {
    this.setState({goalLevel: toValidLevel(e.target.value)})
  }

  handleMethodTypeSelect = e => {
    this.setState({methodType: e})
  }

  handleCustomInputChange = newValue => {
    this.setState({customInput: newValue})
  }

  render() {
    return (
      <div className="goal-box-edit">
        <div className="panels">
          <Panel className="lvl-goal" header="Leveling Goal">
            <div className="lvl-goal-input">
              <div>Goal</div>
              <FormControl
                  type="number"
                  value={this.state.goalLevel}
                  onChange={this.handleGoalLevelChange}
              />
            </div>
          </Panel>
          <Panel className="lvl-method" header="Leveling Method">
            <div className="lvl-method-input">
              <Nav
                  onSelect={this.handleMethodTypeSelect}
                  bsStyle="tabs" stacked activeKey={this.state.methodType}>
                <NavItem eventKey={'sortie'}>Sortie</NavItem>
                <NavItem eventKey={'custom'}>Custom</NavItem>
              </Nav>
              <div style={{flex: 1}}>
                <MethodSortieEdit
                    sortieInput={this.state.sortieInput}
                    visible={this.state.methodType === 'sortie'} />
                <MethodCustomEdit
                    customInput={this.state.customInput}
                    onCustomInputChange={this.handleCustomInputChange}
                    visible={this.state.methodType === 'custom'} />
              </div>
            </div>
          </Panel>
        </div>
        <div className="edit-control">
          <Button>
            <FontAwesome name="trash" />
          </Button>
          <Button >
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }
}

export { GoalBoxEdit }
