import React, { PureComponent } from 'react'
import {
  Button,
  ButtonGroup,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { PTyp } from '../../../ptyp'
import { UpOrDownButton } from './up-or-down-button'
import { ApplyButton } from './apply-button'

class ViewButtons extends PureComponent {
  static propTypes = {
    upAction: PTyp.func,
    downAction: PTyp.func,
    editing: PTyp.bool.isRequired,
    index: PTyp.number.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    isEnabled: PTyp.bool.isRequired,
    isMainTemplate: PTyp.bool.isRequired,

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
      // template,
      upAction, downAction,
      editing, shipTargets,
      index,
      isEnabled, isMainTemplate,
      onStartEdit, onFinishEdit,
      onToggleTemplate, onApplyTemplate,
    } = this.props
    return (
      <ButtonGroup className="template-controls">
        <UpOrDownButton
            action={upAction}
            dir="up" />
        <UpOrDownButton
            action={downAction}
            dir="down" />
        <ApplyButton
            editing={editing}
            shipTargets={shipTargets}
            index={index}
            onApplyTemplate={onApplyTemplate}
            />
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

export { ViewButtons }
