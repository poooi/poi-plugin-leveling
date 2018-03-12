import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import {
  Panel,
  Button,
  FormControl,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'

import {
  expValueFromBaseExp,
  computeExpRange,
} from '../../map-exp'
import { PTyp } from '../../ptyp'
import { Method } from '../../structs'
import { shipStatsAtLevelFuncSelector } from '../../selectors'

import { LevelingMethodPanel } from './leveling-method-panel'
import { QuickGoalLevelEdit } from './quick-goal-level-edit'

const { __ } = window

// to generate sensible initial values
// we use one method as a source to guess another
const fillStates = Method.destruct({
  sortie: (flagship,mvp,rank,baseExp,method) => {
    const expRange = computeExpRange(method)
    return {
      sortieInput: {
        flagship,
        mvp,
        rank,
        baseExpType: baseExp.type,
        expMapId: baseExp.type === 'standard' ? baseExp.mapId : 11,
        expValue: expValueFromBaseExp(baseExp),
      },
      customInput:
        expRange.length === 1 ? { type: 'single', value: expRange[0] } :
      { type: 'range', min: expRange[0], max: expRange[1] },
    }
  },
  custom: exp => {
    const sortieInput = {
      flagship: 'yes',
      mvp: 'yes',
      rank: ['S'],
      baseExpType: 'custom',
      expMapId: 11,
      expValue: exp,
    }
    return {
      sortieInput,
      customInput: exp,
    }
  },
})

const toValidLevel = inp =>
  inp < 1 ? 1 : inp > 165 ? 165 : Math.floor(inp)

const normalizeExpValue = expValue => {
  if (expValue.type === 'single') {
    const { type, value } = expValue
    return { type, value }
  }

  if (expValue.type === 'range') {
    const [a,b] = [expValue.min,expValue.max]
    const [min,max] = a <= b ? [a,b] : [b,a]
    return min === max ?
      { type: 'single', value: min } :
      { type: 'range', min, max }
  }
}

const stateToMethod = state => {
  const { methodType } = state
  if (methodType === 'sortie') {
    const { sortieInput } = state
    const { flagship, mvp, rank, baseExpType } = sortieInput
    const baseExp =
      baseExpType === 'standard' ? { type: 'standard', mapId: sortieInput.expMapId } :
      baseExpType === 'custom' ? {
        type: 'custom',
        value: normalizeExpValue( sortieInput.expValue ),
      } :
      console.error(`Invalid baseExpType: ${baseExpType}`)

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

const prepareState = props => {
  const { goal } = props
  return {
    goalLevel: goal.goalLevel,
    methodType: goal.method.type,
    ...fillStates(goal.method),
  }
}

class GoalBoxEditImpl extends Component {
  static propTypes = {
    // goal: PTyp.Goal.isRequired,
    ship: PTyp.Ship.isRequired,
    rGoals: PTyp.arrayOf(PTyp.RGoalLevel).isRequired,
    shipStatsAtLevel: PTyp.func.isRequired,

    onModifyGoalTable: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
  }


  constructor(props) {
    super(props)
    this.state = prepareState(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prepareState(nextProps))
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
    const {shipStatsAtLevel} = this.props
    const statEst =
      shipStatsAtLevel(this.props.ship.mstId)(this.state.goalLevel)
    const hasStatEst =
      statEst.evasion !== null &&
      statEst.asw !== null &&
      statEst.los !== null

    return (
      <div className="goal-box-edit">
        <div
          style={{marginTop: 5, display: 'flex'}}
          className="panels"
        >
          <Panel
            style={{margin: 5, flex: 1}}
            className="lvl-goal"
          >
            <Panel.Heading
              style={{padding: '2px 5px'}}
            >
              {__('EditLevel.Title')}
            </Panel.Heading>
            <Panel.Body>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                  }}
                >
                  <div style={{flex: 1, marginRight: '.4em'}}>
                    {`${__('EditLevel.Goal')}:`}
                  </div>
                  <FormControl
                    type="number"
                    style={{flex: 4}}
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
            </Panel.Body>
          </Panel>
          <LevelingMethodPanel
            style={{margin: 5, flex: 3}}
            methodType={this.state.methodType}
            sortieInput={this.state.sortieInput}
            customInput={this.state.customInput}
            onMethodTypeSelect={this.handleMethodTypeSelect}
            onSortieInputChange={this.handleSortieInputChange}
            onCustomInputChange={this.handleCustomInputChange}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {
            hasStatEst && (
              <div
                style={{
                  flex: 1,
                  fontSize: 15,
                }}
              >
                {
                  [
                    `${__('GoalBox.ShipStatsAtLv',this.state.goalLevel)}:`,
                    `${__('Sorter.Evasion')}: ${statEst.evasion},`,
                    `${__('Sorter.ASW')}: ${statEst.asw},`,
                    `${__('Sorter.LoS')}: ${statEst.los}`,
                  ].join(' ')
                }
              </div>
            )
          }
          <Button
            style={{
              marginLeft: 5, marginRight: 5,
              width: '8%',
            }}
            onClick={this.handleRemoveGoal}
          >
            <FontAwesome name="trash" />
          </Button>
          <Button
            style={{
              marginLeft: 5, marginRight: 5,
              width: '8%',
            }}
            onClick={this.handleSaveGoal}
          >
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }
}

const GoalBoxEdit = connect(
  createStructuredSelector({
    shipStatsAtLevel: shipStatsAtLevelFuncSelector,
  })
)(GoalBoxEditImpl)

export { GoalBoxEdit, fillStates, stateToMethod }
