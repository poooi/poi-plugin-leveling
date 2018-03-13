import React, { Component } from 'react'
import { Checkbox, FormControl, ButtonGroup, Button } from 'react-bootstrap'
import { mapIdToStr } from 'subtender/kc'

import { ExpValueEdit } from './exp-value-edit'
import { sortedMapIds, getMapExpInfo } from '../../map-exp'

import { PTyp } from '../../ptyp'

const { __ } = window

// TODO: have to disable this for now
/* eslint-disable jsx-a11y/accessible-emoji */

class MethodSortieEdit extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
    sortieInput: PTyp.shape(PTyp.allRequired({
      flagship: PTyp.ternary,
      mvp: PTyp.ternary,
      rank: PTyp.Rank,
      baseExpType: PTyp.oneOf(['standard','custom']),
      expMapId: PTyp.number,
      expValue: PTyp.ExpValue,
    })).isRequired,

    onSortieInputChange: PTyp.func.isRequired,
  }

  handleFlagshipChange = e => {
    const { sortieInput, onSortieInputChange } = this.props
    onSortieInputChange({
      ...sortieInput,
      flagship: e.target.value,
    })
  }

  handleMVPChange = e => {
    const { sortieInput, onSortieInputChange } = this.props
    onSortieInputChange({
      ...sortieInput,
      mvp: e.target.value,
    })
  }

  handleRankButtoToggle = (rank,selected) => () => {
    const { sortieInput, onSortieInputChange } = this.props
    const rankArr = sortieInput.rank

    const afterRank =
      selected ? rankArr.filter(x => x !== rank) : [...rankArr, rank]

    if (afterRank.length > 0) {
      onSortieInputChange({
        ...sortieInput,
        rank: afterRank,
      })
    }
  }

  handleExpValueChange = newValue => {
    const { sortieInput, onSortieInputChange } = this.props
    onSortieInputChange({
      ...sortieInput,
      expValue: newValue,
    })
  }

  handleBaseExpTypeToggle = e => {
    const { sortieInput, onSortieInputChange } = this.props
    onSortieInputChange({
      ...sortieInput,
      baseExpType: e.target.checked ? 'custom' : 'standard',
    })
  }

  handleExpMapChange = e => {
    const { sortieInput, onSortieInputChange } = this.props
    onSortieInputChange({
      ...sortieInput,
      expMapId: Number(e.target.value),
    })
  }

  render() {
    const { visible, sortieInput } = this.props
    const isCustomExp = sortieInput.baseExpType === 'custom'
    // const crossEmoji = (<span role="img" aria-label="cross">✓</span>)
    // const checkEmoji = (<span role="img" aria-label="check">❌</span>)
    return (
      <div
        style={{
          display: visible ? 'flex' : 'none',
          height: '100%',
          flexDirection: 'column',
          padding: 10,
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          <Checkbox
            style={{flex: 2}}
            onChange={this.handleBaseExpTypeToggle}
            checked={isCustomExp}>
            {__('EditMethod.CustomBaseExp')}
          </Checkbox>
          <FormControl
            onChange={this.handleExpMapChange}
            style={{
              flex: 5,
              display: isCustomExp ? 'none' : 'initial',
            }}
            componentClass="select"
            value={sortieInput.expMapId}
          >
            {
              sortedMapIds.map(mapId => (
                <option key={mapId} value={mapId}>
                  {`${mapIdToStr(mapId)}: ${getMapExpInfo(mapId).name}`}
                </option>
              ))
            }
          </FormControl>
          <div
            style={{
              flex: 5,
              display: isCustomExp ? 'initial' : 'none',
            }}
          >
            <ExpValueEdit
              expValue={sortieInput.expValue}
              onValueChange={this.handleExpValueChange}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <FormControl
            onChange={this.handleFlagshipChange}
            style={{flex: 1}}
            componentClass="select"
            value={sortieInput.flagship} >
            <option value="maybe">{__('Method.Flagship')}: ✓/❌</option>
            <option value="yes">{__('Method.Flagship')}: ✓</option>
            <option value="no">{__('Method.Flagship')}: ❌</option>
          </FormControl>
          <FormControl
            onChange={this.handleMVPChange}
            style={{flex: 1}}
            componentClass="select"
            value={sortieInput.mvp} >
            <option value="maybe">MVP: ✓/❌</option>
            <option value="yes">MVP: ✓</option>
            <option value="no">MVP: ❌</option>
          </FormControl>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 5,
          }}
        >
          <div style={{marginRight: '.4em'}}>
            {__('Method.Rank')}:
          </div>
          <ButtonGroup
            style={{flex: 1}}
          >
            {
              ['S','A','B','C','D','E'].map(rank => {
                const selected = sortieInput.rank.indexOf(rank) !== -1
                return (
                  <Button
                    style={{marginTop: 0}}
                    onClick={this.handleRankButtoToggle(rank,selected)}
                    bsStyle={selected ? "primary" : "default"}
                    key={rank}>
                    {rank}
                  </Button>
                )
              })
            }
          </ButtonGroup>
        </div>
      </div>
    )
  }
}

export { MethodSortieEdit }
