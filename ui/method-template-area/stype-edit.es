import _ from 'lodash'
import React, { Component } from 'react'
import {
  Panel,
} from 'react-bootstrap'
import {
  Button,
  Popover, Menu, MenuItem,
} from '@blueprintjs/core'

import { PTyp } from '../../ptyp'

const { __ } = window.i18n["poi-plugin-leveling"]

class STypeEdit extends Component {
  static propTypes = {
    disabled: PTyp.bool.isRequired,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
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
      disabled,
    } = this.props
    const {
      stypeInfoIncluded,
      stypeInfoMissing,
    } = this.splitSTypes()
    const addDisabled = disabled || stypeInfoMissing.length === 0
    const removeDisabled = disabled || stypeInfoIncluded.length === 0
    return (
      <Panel
        style={{margin: 5, flex: 1}}
      >
        <Panel.Heading
          style={{padding: '2px 5px'}}
        >
          {__('Template.Types')}
        </Panel.Heading>
        <Panel.Body>
          <Popover
            fill
            placement="bottom-start"
            disabled={addDisabled}
            content={
              <Menu className="leveling-scrollable-menu" style={{maxHeight: 300, overflowY: 'auto'}}>
                {
                  stypeInfoMissing.map( ({id,name}) => (
                    <MenuItem
                      key={id}
                      text={`${name} (${id})`}
                      onClick={() => this.handleAddOrRemoveSType('add')(id)}
                    />
                  ))
                }
              </Menu>
            }
          >
            <Button fill disabled={addDisabled} rightIcon="caret-down">
              {__('Template.AddType')}
            </Button>
          </Popover>
          <Popover
            fill
            placement="bottom-start"
            disabled={removeDisabled}
            content={
              <Menu className="leveling-scrollable-menu" style={{maxHeight: 300, overflowY: 'auto'}}>
                {
                  stypeInfoIncluded.map( ({id,name}) => (
                    <MenuItem
                      key={id}
                      text={`${name} (${id})`}
                      onClick={() => this.handleAddOrRemoveSType('remove')(id)}
                    />
                  ))
                }
              </Menu>
            }
          >
            <Button fill disabled={removeDisabled} rightIcon="caret-down">
              {__('Template.RemoveType')}
            </Button>
          </Popover>
        </Panel.Body>
      </Panel>
    )
  }
}

export { STypeEdit }
