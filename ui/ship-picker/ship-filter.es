import { modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { describeFilterWith } from '../../shiplist-ops'
import { mapDispatchToProps } from '../../store'
import {
  filtersSelector,
} from './selectors'
import {
  getShipTypeInfoFuncSelector,
  validShipTypeIdsSelector,
} from '../../selectors'

class ShipFilterImpl extends PureComponent {
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

  render() {
    const {filters, getShipTypeInfo, stypeIds} = this.props
    const { __ } = window
    const describeFilter = describeFilterWith(getShipTypeInfo,__)
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: 5,
        }}
        className="filter-group">
        <ButtonGroup justified>
          <DropdownButton
            onSelect={this.handleSelectFilter('type')}
            id="ship-filter-type"
            title={`${__('Sorter.Type')}: ${describeFilter('type')(filters.type)}`}>
            <MenuItem
              key="all" eventKey="all">
              {__('Filter.All')}
            </MenuItem>
            {
              stypeIds.map(id => {
                const {name} = getShipTypeInfo(id)
                return (
                  <MenuItem
                    key={id} eventKey={id}>
                    {`${name} (${id})`}
                  </MenuItem>
                )
              })
            }
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup
          className="ship-filter-bg-level"
          justified>
          <DropdownButton
            onSelect={this.handleSelectFilter('level')}
            id="ship-filter-level"
            title={`${__('Sorter.Level')}: ${describeFilter('level')(filters.level)}`}>
            <MenuItem key="all" eventKey="all">
              {__('Filter.All')}
            </MenuItem>
            <MenuItem key="ge-100" eventKey="ge-100">
              Lv. ≥ 100
            </MenuItem>
            <MenuItem key="lt-99" eventKey="lt-99">
              {"Lv. < 99"}
            </MenuItem>
            <MenuItem key="under-final" eventKey="under-final">
              {__('Filter.UnderFinalRemodelLevel')}
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup justified>
          <DropdownButton
            onSelect={this.handleSelectFilter('fleet')}
            id="ship-filter-fleet"
            title={`${__('Sorter.Fleet')}: ${describeFilter('fleet')(filters.fleet)}`}>
            <MenuItem key="all" eventKey="all">
              {__('Filter.All')}
            </MenuItem>
            {
              [1,2,3,4].map( fleet => (
                <MenuItem key={fleet} eventKey={fleet}>
                  {__(`Filter.FleetX`,fleet)}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup justified>
          <DropdownButton
            onSelect={this.handleSelectFilter('lock')}
            id="ship-filter-lock"
            title={`${__('Sorter.Lock')}: ${describeFilter('lock')(filters.lock)}`}>
            <MenuItem key="all" eventKey="all">
              {__('Filter.All')}
            </MenuItem>
            <MenuItem key={true} eventKey={true}>
              {__('Filter.Locked')}
            </MenuItem>
            <MenuItem key={false} eventKey={false}>
              {__('Filter.Unlocked')}
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </div>
    )
  }
}

const ShipFilter = connect(
  createStructuredSelector({
    getShipTypeInfo: getShipTypeInfoFuncSelector,
    stypeIds: validShipTypeIdsSelector,
    filters: filtersSelector,
  }),
  mapDispatchToProps
)(ShipFilterImpl)

export { ShipFilter }
