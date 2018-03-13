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
    template: PTyp.object.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    isEnabled: PTyp.bool.isRequired,
    isMainTemplate: PTyp.bool.isRequired,

    onStartEdit: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
    onToggleTemplate: PTyp.func.isRequired,
    onApplyTemplate: PTyp.func.isRequired,
  }

  static defaultProps = {
    upAction: null,
    downAction: null,
  }

  render() {
    const {
      // template,
      upAction, downAction,
      editing, shipTargets,
      isEnabled, isMainTemplate,
      onStartEdit, onFinishEdit,
      onToggleTemplate, onApplyTemplate,
      template,
    } = this.props
    const btnStyle = {marginTop: 0, marginRight: '1%'}
    return (
      <ButtonGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <UpOrDownButton
          style={btnStyle}
          action={upAction}
          dir="up"
        />
        <UpOrDownButton
          style={btnStyle}
          action={downAction}
          dir="down"
        />
        <ApplyButton
          style={btnStyle}
          editing={editing}
          shipTargets={shipTargets}
          templateId={template.id}
          onApplyTemplate={onApplyTemplate}
        />
        <Button
          bsStyle={isEnabled ? 'success' : 'danger'}
          onClick={onToggleTemplate}
          disabled={isMainTemplate || editing}
          style={{
            ...btnStyle,
            flex: 2,
          }}
        >
          <FontAwesome name={isEnabled ? 'check-square-o' : 'square-o'} />
        </Button>
        <Button
          onClick={editing ? onFinishEdit : onStartEdit}
          style={{marginTop: 0, flex: 1}}
        >
          <FontAwesome name={editing ? 'undo' : 'pencil'} />
        </Button>
      </ButtonGroup>
    )
  }
}

export { ViewButtons }
