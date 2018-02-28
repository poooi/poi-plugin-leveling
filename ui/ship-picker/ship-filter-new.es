import { modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import {
  filtersSelector,
} from './selectors'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'

import {
  getShipTypeInfoFuncSelector,
  validShipTypeIdsSelector,
} from '../../selectors'

class ShipFilterNewImpl extends PureComponent {
  static propTypes = {
    getShipTypeInfo: PTyp.func.isRequired,
    stypeIds: PTyp.array.isRequired,
    filters: PTyp.ShipFilters.isRequired,

    uiModify: PTyp.func.isRequired,
  }

  modifyFilter = modifier =>
    this.props.uiModify(
      modifyObject(
        'shipTab',
        modifyObject('filters', modifier)
      )
    )

  handleSelectFilter = key => value =>
    this.modifyFilter(
      modifyObject(key, () => value)
    )

  renderLabelToggleGroups = ({
    label, labelText,
    style, values, renderValueToggle,
    curValue,
    onChange,
  }) => (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        ...style,
      }}>
      <div style={{marginRight: '1em'}}>{labelText}</div>
      <ToggleButtonGroup
        value={curValue}
        type="radio"
        name={label}
        onChange={onChange}
      >
        {
          values.map(value => (
            <ToggleButton
              style={{marginTop: 0}}
              value={value}>
              {renderValueToggle(value)}
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>
    </div>
  )

  render() {
    const {__} = window
    const {filters, stypeIds, getShipTypeInfo} = this.props
    return (
      <div
        style={{
          marginBottom: 5,
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <div style={{marginRight: '1em'}}>
            {__('Sorter.Type')}
          </div>
          <div>
            {
              ['all', ...stypeIds].map(stypeIdOrAll => {
                let content
                let styleExtra
                if (stypeIdOrAll === 'all') {
                  content = __('Filter.All')
                  styleExtra = {minWidth: '4em'}
                } else {
                  const {name} = getShipTypeInfo(stypeIdOrAll)
                  content = `${name} (${stypeIdOrAll})`
                  styleExtra = {}
                }
                return (
                  <Button
                    active={filters.type === stypeIdOrAll}
                    bsSize="small"
                    style={{
                      marginRight: 2,
                      marginTop: 0,
                      marginBottom: 2,
                      padding: '5px 10px',
                      ...styleExtra,
                    }}
                    key={stypeIdOrAll}
                    onClick={() => this.handleSelectFilter('type')(stypeIdOrAll)}
                  >
                    {content}
                  </Button>
                )
              })
            }
          </div>
        </div>
        {
          this.renderLabelToggleGroups({
            label: 'level', labelText: 'Level', style: {marginBottom: 5},
            values: ['all', 'ge-100', 'lt-99', 'under-final'],
            curValue: filters.level,
            renderValueToggle: value => (
              value === 'all' ? __('Filter.All') :
              value === 'ge-100' ? 'Lv. ≥ 100' :
              value === 'lt-99' ? 'Lv. < 99' :
              value === 'under-final' ? __('Filter.UnderFinalRemodelLevel') :
              '???'
            ),
            onChange: this.handleSelectFilter('level'),
          })
        }
        <div
          style={{display: 'flex'}}
        >
          {
            this.renderLabelToggleGroups({
              label: 'fleet', labelText: 'Fleet', style: {},
              values: ['all', 1, 2, 3, 4],
              curValue: filters.fleet,
              renderValueToggle: value => (
                value === 'all' ? __('Filter.All') : value
              ),
              onChange: this.handleSelectFilter('fleet'),
            })
          }
          {
            this.renderLabelToggleGroups({
              label: 'lock', labelText: 'Lock', style: {marginLeft: 10},
              values: ['all', true, false],
              curValue: filters.lock,
              renderValueToggle: value => (
                value === 'all' ? __('Filter.All') :
                typeof value === 'boolean' ? (
                  <FontAwesome name={value ? 'lock' : 'unlock'} />
                ) : '???'
              ),
              onChange: this.handleSelectFilter('lock'),
            })
          }
        </div>
      </div>
    )
  }
}

const ShipFilterNew = connect(
  createStructuredSelector({
    getShipTypeInfo: getShipTypeInfoFuncSelector,
    stypeIds: validShipTypeIdsSelector,
    filters: filtersSelector,
  }),
  mapDispatchToProps
)(ShipFilterNewImpl)

export { ShipFilterNew }
