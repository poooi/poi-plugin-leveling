import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { describeFilterWith } from '../../../shiplist-ops'

const { _ } = window

class ShipFilter extends Component {
  static propTypes = {
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    stypes: PTyp.arrayOf(PTyp.number).isRequired,
    filters: PTyp.ShipFilters.isRequired,

    onModifyFilters: PTyp.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    const simplify = props => {
      const { stypeInfo, stypes, filters, onModifyFilters } = props
      const sortedSTypes =
        stypes === [...(stypes || [])].sort((x,y) => x-y)

      return {
        stypeInfoLen: stypeInfo.length,
        sortedSTypes,
        filters,
        onModifyFilters,
      }
    }

    return ! _.isEqual(
      simplify(this.props),
      simplify(nextProps))
  }

  handleSelectFilter = key => value => {
    const { onModifyFilters } = this.props
    onModifyFilters(filters => ({
      ...filters,
      [key]: value,
    }))
  }

  render() {
    const { filters, stypes, stypeInfo } = this.props
    const describeFilter = describeFilterWith(stypeInfo)
    return (
      <div className="filter-group">
        <ButtonGroup justified>
          <DropdownButton
              onSelect={this.handleSelectFilter('type')}
              id="ship-filter-type"
              title={`Type: ${describeFilter('type')(filters.type)}`}>
            <MenuItem
                key="all" eventKey="all">
              All
            </MenuItem>
            {
              (stypeInfo || []).map( ({id, name}) =>
                stypes.indexOf(id) !== -1 && (
                  <MenuItem
                      key={id} eventKey={id}>
                    {`${name} (${id})`}
                  </MenuItem>
                ))
            }
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup
            className="ship-filter-bg-level"
            justified>
          <DropdownButton
              onSelect={this.handleSelectFilter('level')}
              id="ship-filter-level"
              title={`Level: ${describeFilter('level')(filters.level)}`}>
            <MenuItem key="all" eventKey="all">
              All
            </MenuItem>
            <MenuItem key="ge-100" eventKey="ge-100">
              Lv. ≥ 100
            </MenuItem>
            <MenuItem key="lt-99" eventKey="lt-99">
              {"Lv. < 99"}
            </MenuItem>
            <MenuItem key="under-final" eventKey="under-final">
              {"Under Final Remodel Level"}
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup justified>
          <DropdownButton
              onSelect={this.handleSelectFilter('fleet')}
              id="ship-filter-fleet"
              title={`Fleet: ${describeFilter('fleet')(filters.fleet)}`}>
            <MenuItem key="all" eventKey="all">
              All
            </MenuItem>
            {
              [1,2,3,4].map( fleet => (
                <MenuItem key={fleet} eventKey={fleet}>
                  {`Fleet ${fleet}`}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup justified>
          <DropdownButton
              onSelect={this.handleSelectFilter('lock')}
              id="ship-filter-lock"
              title={`Lock: ${describeFilter('lock')(filters.lock)}`}>
            <MenuItem key="all" eventKey="all">
              All
            </MenuItem>
            <MenuItem key={true} eventKey={true}>
              Locked
            </MenuItem>
            <MenuItem key={false} eventKey={false}>
              Unlocked
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </div>
    )
  }
}

export { ShipFilter }
