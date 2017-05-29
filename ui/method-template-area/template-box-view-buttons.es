import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { Template } from '../../structs'

const { FontAwesome } = window

class TemplateBoxViewButtons extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    upAction: PTyp.func,
    downAction: PTyp.func,
    editing: PTyp.bool.isRequired,
    index: PTyp.number.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,

    onStartEdit: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
    onToggleTemplate: PTyp.func.isRequired,
    onApplyTemplate: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
    upAction: null,
    downAction: null,
  }

  render() {
    const {
      template,
      upAction, downAction,
      editing, shipTargets,
      index,
      onStartEdit, onFinishEdit,
      onToggleTemplate, onApplyTemplate,
    } = this.props
    const isMainTemplate = template.type === 'main'
    const isEnabled = Template.isEnabled(template)
    return (
      <ButtonGroup className="template-controls">
        <Button
            disabled={typeof upAction !== 'function'}
            onClick={upAction}
            style={{flex: 1}} >
          <FontAwesome name="angle-up" />
        </Button>
        <Button
            disabled={typeof downAction !== 'function'}
            onClick={downAction}
            style={{flex: 1}} >
          <FontAwesome name="angle-down" />
        </Button>
        <ButtonGroup
            className="dropdown-apply-to"
            style={{flex: 4}}
            justified>
          <DropdownButton
              id={`tb-view-dd-apply-${index}`}
              disabled={editing || shipTargets.length === 0}
              onSelect={onApplyTemplate}
              title="Apply to">
            {
              shipTargets.map( shipTarget => {
                const { name, rstId, level, goalLevel } = shipTarget
                const content = `${name} (${rstId}) Lv. ${level} ⇒ Lv.${goalLevel}`
                return (
                  <MenuItem key={rstId} eventKey={rstId}>
                    {content}
                  </MenuItem>
                )
              })
            }
            <MenuItem divider />
            <MenuItem key="all" eventKey="all">All Goals Above</MenuItem>
          </DropdownButton>
        </ButtonGroup>
        <Button
            bsStyle={isEnabled ? "success" : "danger"}
            onClick={onToggleTemplate}
            disabled={isMainTemplate || editing}
            style={{flex: 2}}
        >
          <FontAwesome name={isEnabled ? "check-square-o" : "square-o"} />
        </Button>
        <Button onClick={editing ? onFinishEdit : onStartEdit} style={{flex: 1}}>
          <FontAwesome name={editing ? "undo" : "pencil"} />
        </Button>
      </ButtonGroup>
    )
  }
}

export { TemplateBoxViewButtons }
