import React, { Component } from 'react'
import {
  Panel,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const { _, __ } = window

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

  shouldComponentUpdate(nextProps) {
    const simplify = props => {
      const {
        disabled,
        stypes,
        stypeInfo,
        index,
        onModifySTypes,
      } = props

      const sortedSTypes = stypes === null ? [] : [...stypes].sort((x,y) => x-y)

      return {
        disabled,
        // comes from api_start2,
        // existing content is very unlikely to be changed
        // so comparing on array length is good enough.
        stypeInfoLen: stypeInfo.length,
        // we have been carefully maintaining the uniqueness
        // of every ship type in "stypes",
        // so a quick comparison on sorted stypes
        // should give us enough clue.
        sortedSTypes,
        index,
        onModifySTypes,
      }
    }

    return ! _.isEqual(
      simplify(this.props),
      simplify(nextProps))
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
      <Panel
        className="stype"
      >
        <Panel.Heading>
          {__('Template.Types')}
        </Panel.Heading>
        <Panel.Body>
          <ButtonGroup justified>
            <DropdownButton
              id={`tb-edit-dd-add-${index}`}
              onSelect={this.handleAddOrRemoveSType('add')}
              disabled={disabled || stypeInfoMissing.length === 0}
              title={__('Template.AddType')}>
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
              onSelect={this.handleAddOrRemoveSType('remove')}
              disabled={disabled || stypeInfoIncluded.length === 0}
              title={__('Template.RemoveType')}>
              {
                stypeInfoIncluded.map( ({id,name}) => (
                  <MenuItem key={id} eventKey={id}>
                    {`${name} (${id})`}
                  </MenuItem>
                ))
              }
            </DropdownButton>
          </ButtonGroup>
        </Panel.Body>
      </Panel>
    )
  }
}

export { STypeEdit }
