import React, { Component } from 'react'
import {
  Panel,
  Button,
  FormControl,
  Nav, NavItem,
} from 'react-bootstrap'

import { expValueFromBaseExp, computeExpRange } from '../../map-exp'
import { PTyp } from '../../ptyp'

import { MethodSortieEdit } from './method-sortie-edit'
import { MethodCustomEdit } from './method-custom-edit'
import { QuickGoalLevelEdit } from './quick-goal-level-edit'

const { FontAwesome } = window

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
        baseExpType: baseExp.type,
        expMap: baseExp.type === 'standard' ? baseExp.map : '1-1',
        expValue: expValueFromBaseExp(baseExp),
      },
      customInput:
        expRange.length === 1
        ? { type: 'single', value: expRange[0] }
        : { type: 'range', min: expRange[0], max: expRange[1] },
    }
  }

  if (method.type === 'custom') {
    const sortieInput = {
      flagship: 'yes',
      mvp: 'yes',
      rank: ['S'],
      baseExpType: 'custom',
      expMap: '1-1',
      expValue: method.exp,
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

const normalizeExpValue = expValue => {
  if (expValue.type === 'single') {
    const { type, value } = expValue
    return { type, value }
  }

  if (expValue.type === 'range') {
    const [a,b] = [expValue.min,expValue.max]
    const [min,max] = a <= b ? [a,b] : [b,a]
    return min === max
      ? { type: 'single', value: min }
      : { type: 'range', min, max }
  }
}

const stateToMethod = state => {
  const { methodType } = state
  if (methodType === 'sortie') {
    const { sortieInput } = state
    const { flagship, mvp, rank, baseExpType } = sortieInput
    const baseExp =
        baseExpType === 'standard'
      ? { type: 'standard', map: sortieInput.expMap }
      : baseExpType === 'custom'
      ? { type: 'custom', value: normalizeExpValue( sortieInput.expValue ) }
      : console.error(`Invalid baseExpType: ${baseExpType}`)

    return {
      type: 'sortie',
      flagship,
      rank,
      mvp,
      baseExp,
    }
  }

  if (methodType === 'custom') {
    const { customInput } = state
    return {
      type: 'custom',
      exp: normalizeExpValue(customInput),
    }
  }

  console.error(`Invalid methodType: ${methodType}`)
}

class GoalBoxEdit extends Component {
  static propTypes = {
    goal: PTyp.Goal.isRequired,
    ship: PTyp.Ship.isRequired,
    rGoals: PTyp.arrayOf(PTyp.RGoalLevel).isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
  }

  static prepareState = props => {
    const { goal } = props
    return {
      goalLevel: goal.goalLevel,
      methodType: goal.method.type,
      ...fillStates(goal.method),
    }
  }

  constructor(props) {
    super(props)
    this.state = GoalBoxEdit.prepareState(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(GoalBoxEdit.prepareState(nextProps))
  }

  handleGoalLevelChange = e => {
    this.setState({goalLevel: toValidLevel(e.target.value)})
  }

  handleRGoalLevelClick = newValue => () =>
    this.setState({goalLevel: newValue})

  handleMethodTypeSelect = e => {
    this.setState({methodType: e})
  }

  handleSortieInputChange = newValue =>
    this.setState({sortieInput: newValue})

  handleCustomInputChange = newValue => {
    this.setState({customInput: newValue})
  }

  handleSaveGoal = () => {
    const { onModifyGoalTable, onFinishEdit, ship } = this.props
    const method = stateToMethod( this.state )
    const goal = {
      rosterId: ship.rstId,
      goalLevel: this.state.goalLevel,
      method,
    }

    onModifyGoalTable(gt => ({...gt, [ship.rstId]: goal}))
    onFinishEdit()
  }

  handleRemoveGoal = () => {
    const { onModifyGoalTable, ship } = this.props
    onModifyGoalTable(gt => {
      const newGt = {...gt}
      delete newGt[ship.rstId]
      return newGt
    })
  }

  render() {
    return (
      <div className="goal-box-edit">
        <div className="panels">
          <Panel className="lvl-goal" header="Leveling Goal">
            <div className="lvl-goal-input">
              <div className="goal-inp-row">
                <div>Goal:</div>
                <FormControl
                    type="number"
                    value={this.state.goalLevel}
                    onChange={this.handleGoalLevelChange}
                />
              </div>
              {
                this.props.rGoals.length > 0 && (
                  <QuickGoalLevelEdit
                      rstId={this.props.ship.rstId}
                      onRGoalLevelClick={this.handleRGoalLevelClick}
                      goalLevel={this.state.goalLevel}
                      rGoals={this.props.rGoals}
                  />
                )
              }
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
                    onSortieInputChange={this.handleSortieInputChange}
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
          <Button onClick={this.handleRemoveGoal}>
            <FontAwesome name="trash" />
          </Button>
          <Button onClick={this.handleSaveGoal} >
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }
}

export { GoalBoxEdit }
