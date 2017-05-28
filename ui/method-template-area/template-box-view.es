import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { prepareMethodText } from '../goal-area/goal-list/method-view'

const { _, FontAwesome } = window

class TemplateBoxView extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    upEnabled: PTyp.bool.isRequired,
    downEnabled: PTyp.bool.isRequired,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    editing: PTyp.bool.isRequired,
    index: PTyp.number.isRequired,

    onStartEdit: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
    onModifyTemplateListAtIndex: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
  }

  // get list of **sorted** ship types depending on the situation:
  // - when we are looking at the main template, the full ship type is returned
  // - otherwise we show either template settings, or template editing the state.
  getSTypes = () => {
    const { stypeInfo, editing, template, stypes } = this.props
    if (template.type === 'main')
      return stypeInfo.map(({id}) => id)

    const currentSTypes = editing ? stypes : template.stypes
    return _.uniq(currentSTypes).sort((x,y) => x-y)
  }

  interpretSType = stype => {
    const { stypeInfo } = this.props
    const name = stypeInfo.find(x => x.id === stype).name
    return (<div className="stype-element" key={stype}>{`${name} (${stype})`}</div>)
  }

  handleToggleTemplate = () => {
    const { index, template, onModifyTemplateListAtIndex } = this.props
    if (template.type === 'custom') {
      onModifyTemplateListAtIndex(index, tmpl => ({
        ...tmpl,
        enabled: !tmpl.enabled,
      }))
      return
    }

    console.error(`Invalid operation on template of type ${template.type}`)
  }

  render() {
    const {
      template,
      upEnabled, downEnabled,
      editing,
      index,
      onStartEdit, onFinishEdit,
    } = this.props
    const isMainTemplate = template.type === 'main'
    const isEnabled = isMainTemplate || template.enabled
    const methodText = prepareMethodText( template.method )
    return (
      <div className="template-view">
        <div className="template-info-view">
          <div className="stype-col">
            <div className="header">Types</div>
            <div className="stype-content content">
              {
                this.getSTypes().map(this.interpretSType)
              }
            </div>
          </div>
          <div className="method-col">
            <div className="header">Method</div>
            <div className="content main">{methodText.main}</div>
            <div className="content second">{methodText.second}</div>
          </div>
        </div>
        <ButtonGroup className="template-controls">
          <Button
              disabled={!upEnabled}
              style={{flex: 1}} >
            <FontAwesome name="angle-up" />
          </Button>
          <Button
              disabled={!downEnabled}
              style={{flex: 1}} >
            <FontAwesome name="angle-down" />
          </Button>
          <ButtonGroup
              className="dropdown-apply-to"
              style={{flex: 4}}
              justified>
            <DropdownButton
                id={`tb-view-dd-apply-${index}`}
                disabled={editing}
                title="Apply to">
              <MenuItem eventKey="1">All applicable current goals</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="g-1">Goal 1</MenuItem>
              <MenuItem eventKey="g-2">Goal 2</MenuItem>
              <MenuItem eventKey="g-3">Goal 3</MenuItem>
              <MenuItem eventKey="g-4">Goal 4</MenuItem>
            </DropdownButton>
          </ButtonGroup>
          <Button
              bsStyle={isEnabled ? "success" : "danger"}
              onClick={this.handleToggleTemplate}
              disabled={isMainTemplate || editing}
              style={{flex: 2}}
          >
            <FontAwesome name={isEnabled ? "check-square-o" : "square-o"} />
          </Button>
          <Button onClick={editing ? onFinishEdit : onStartEdit} style={{flex: 1}}>
            <FontAwesome name={editing ? "undo" : "pencil"} />
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

export { TemplateBoxView }
