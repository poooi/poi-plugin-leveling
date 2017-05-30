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
    index: PTyp.number.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    onApplyTemplate: PTyp.func.isRequired,
  }

  render() {
    const {
      editing, shipTargets,
      index,
      onApplyTemplate,
    } = this.props
    return (
      <ButtonGroup
          className="dropdown-apply-to"
          style={{flex: 4}}
          justified>
        <DropdownButton
            id={`tb-view-dd-apply-${index}`}
            disabled={editing || shipTargets.length === 0}
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
