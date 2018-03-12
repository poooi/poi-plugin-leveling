import React, { PureComponent } from 'react'
import {
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

const { __ } = window

class ApplyButton extends PureComponent {
  static propTypes = {
    editing: PTyp.bool.isRequired,
    templateId: PTyp.number.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    onApplyTemplate: PTyp.func.isRequired,
    style: PTyp.object.isRequired,
  }

  render() {
    const {
      editing, shipTargets,
      templateId,
      onApplyTemplate,
      style,
    } = this.props
    return (
      <ButtonGroup
        className="dropdown-apply-to"
        style={{
          display: 'block',
          flex: 4,
          ...style,
        }}
        justified>
        <DropdownButton
          id={`tb-view-dd-apply-${templateId}`}
          disabled={editing || shipTargets.length === 0}
          style={{marginTop: 0}}
          onSelect={onApplyTemplate}
          title={__('Template.ApplyTo')}>
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
          <MenuItem key="all" eventKey="all">
            {__('Template.AllGoalsAbove')}
          </MenuItem>
        </DropdownButton>
      </ButtonGroup>
    )
  }
}

export { ApplyButton }
