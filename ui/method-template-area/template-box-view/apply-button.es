import React, { PureComponent } from 'react'
import {
  Button,
  Popover, Menu, MenuItem, MenuDivider,
} from '@blueprintjs/core'

import { PTyp } from '../../../ptyp'

const { __ } = window.i18n["poi-plugin-leveling"]

class ApplyButton extends PureComponent {
  static propTypes = {
    editing: PTyp.bool.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    onApplyTemplate: PTyp.func.isRequired,
    style: PTyp.object.isRequired,
  }

  render() {
    const {
      editing, shipTargets,
      onApplyTemplate,
      style,
    } = this.props
    const disabled = editing || shipTargets.length === 0
    return (
      <Popover
        fill
        placement="bottom-start"
        disabled={disabled}
        content={
          <Menu className="leveling-scrollable-menu" style={{maxHeight: 300, overflowY: 'auto'}}>
            {
              shipTargets.map( shipTarget => {
                const { name, rstId, level, goalLevel } = shipTarget
                const content = `${name} (${rstId}) Lv. ${level} ⇒ Lv.${goalLevel}`
                return (
                  <MenuItem
                    key={rstId}
                    text={content}
                    onClick={() => onApplyTemplate(rstId)}
                  />
                )
              })
            }
            <MenuDivider />
            <MenuItem
              key="all"
              text={__('Template.AllGoalsAbove')}
              onClick={() => onApplyTemplate('all')}
            />
          </Menu>
        }
      >
        <Button
          fill
          disabled={disabled}
          style={{
            display: 'block',
            flex: 4,
            marginTop: 0,
            ...style,
          }}
          rightIcon="caret-down"
        >
          {__('Template.ApplyTo')}
        </Button>
      </Popover>
    )
  }
}

export { ApplyButton }
