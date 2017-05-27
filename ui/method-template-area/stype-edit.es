import React, { Component } from 'react'
import {
  Panel,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { LevelingMethodPanel } from '../goal-area/goal-list/leveling-method-panel'
import { fillStates } from '../goal-area/goal-list/goal-box-edit'

const { FontAwesome } = window

class STypeEdit extends Component {
  static propTypes = {
    disabled: PTyp.bool.isRequired,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    index: PTyp.number.isRequired,
    onModifySTypes: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
  }

  splitSTypes = () => {
    const {
      disabled,
      stypes,
      stypeInfo,
    } = this.props
    const stypeInfoIncluded = []
    const stypeInfoMissing = []
    if (!disabled)
      stypeInfo.map(x => {
        const { id } = x
        if (stypes.indexOf(id) !== -1)
          stypeInfoIncluded.push(x)
        else
          stypeInfoMissing.push(x)
      })

    return {
      stypeInfoIncluded,
      stypeInfoMissing,
    }
  }

  handleAddOrRemoveSType = addOrRemove => stype => {
    const { onModifySTypes } = this.props
    if (addOrRemove === 'add') {
      onModifySTypes( stypes =>
        stypes.indexOf(stype) === -1
          ? [...stypes, stype]
          : stypes)
    }

    if (addOrRemove === 'remove') {
      onModifySTypes( stypes => stypes.filter(x => x !== stype) )
    }
  }

  render() {
    const {
      index,
      disabled,
    } = this.props
    const {
      stypeInfoIncluded,
      stypeInfoMissing,
    } = this.splitSTypes()
    return (
      <Panel className="stype" header="Types">
        <ButtonGroup justified>
          <DropdownButton
              id={`tb-edit-dd-add-${index}`}
              disabled={disabled || stypeInfoMissing.length === 0}
              title="Add Type">
            {
              stypeInfoMissing.map( ({id,name}) => (
                <MenuItem key={id} eventKey={id}>
                  {`${name} (${id})`}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup justified>
          <DropdownButton
              id={`tb-edit-dd-rm-${index}`}
              disabled={disabled || stypeInfoIncluded.length === 0}
              title="Remove Type">
            {
              stypeInfoIncluded.map( ({id,name}) => (
                <MenuItem key={id} eventKey={id}>
                  {`${name} (${id})`}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </ButtonGroup>
      </Panel>
    )
  }
}

export { STypeEdit }
