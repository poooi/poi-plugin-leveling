import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class ShipFilter extends Component {
  static propTypes = {
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    stypes: PTyp.arrayOf(PTyp.number).isRequired,
    filters: PTyp.ShipFilters.isRequired,

    onModifyFilters: PTyp.func.isRequired,
  }

  handleSelectFilter = key => value => {
    const { onModifyFilters } = this.props
    onModifyFilters(filters => ({
      ...filters,
      [key]: value,
    }))
  }

  describeFilter = filterName => {
    if (filterName === 'type')
      return tNum => {
        const { stypeInfo } = this.props
        if (tNum === 'all')
          return 'All'

        const stInd = stypeInfo.findIndex( ({id}) => id === tNum )
        return stInd === -1 ? tNum : `${this.props.stypeInfo[stInd].name} (${tNum})`
      }

    if (filterName === 'level')
      return l =>
          l === 'all' ? 'All'
        : l === 'ge-100' ? '≥ 100'
        : l === 'lt-99' ? '< 99'
        : l === 'under-final' ? '< F. Rmdl.'
        : l

    if (filterName === 'fleet')
      return fNum => fNum === 'all' ? 'All' : `Fleet ${fNum}`

    if (filterName === 'lock')
      return v => v === 'all' ? 'All' : (v ? 'Locked' : 'Unlocked')
    return x => x
  }

  render() {
    const { filters, stypes, stypeInfo } = this.props
    return (
      <div className="filter-group">
        <ButtonGroup justified>
          <DropdownButton
              onSelect={this.handleSelectFilter('type')}
              id="ship-filter-type"
              title={`Type: ${this.describeFilter('type')(filters.type)}`}>
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
              title={`Level: ${this.describeFilter('level')(filters.level)}`}>
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
              title={`Fleet: ${this.describeFilter('fleet')(filters.fleet)}`}>
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
              title={`Lock: ${this.describeFilter('lock')(filters.lock)}`}>
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
