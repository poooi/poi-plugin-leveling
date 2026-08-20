/*
   controls for ship list rows
 */
import React, { PureComponent } from 'react'
import { Button } from '@blueprintjs/core'
import FontAwesome from 'react-fontawesome'
import { PTyp } from '../../../ptyp'

class RowControls extends PureComponent {
  static propTypes = {
    mode: PTyp.string.isRequired,
    /* all callbacks are thunks that expect no args */
    onAddToGoalTable: PTyp.func.isRequired,
    onRemoveFromGoalTable: PTyp.func.isRequired,
    onSwitchToRemovalConfirm: PTyp.func.isRequired,
    onCancelRemovalConfirm: PTyp.func.isRequired,
  }

  render() {
    const {
      mode,
      onAddToGoalTable,
      onRemoveFromGoalTable,
      onSwitchToRemovalConfirm,
      onCancelRemovalConfirm,
    } = this.props
    const btnStyle = {
      marginTop: 0, marginBottom: 0,
      height: 22,
      maxWidth: '5em',
      width: '80%',
    }
    if (mode === 'add' || mode === 'remove') {
      return (
        <Button
          size="small"
          onClick={
            mode === 'add' ? (
              /* add to goal table */
              onAddToGoalTable
            ) : (
              /* switch to removal confirm */
              onSwitchToRemovalConfirm
            )
          }
          style={btnStyle}
        >
          <FontAwesome name={mode === 'add' ? 'plus' : 'minus'} />
        </Button>
      )
    }
    if (mode === 'remove-confirm') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            intent="danger"
            style={{
              ...btnStyle,
              marginRight: 5,
            }}
            onClick={onRemoveFromGoalTable}
          >
            <FontAwesome name="trash" />
          </Button>
          <Button
            size="small"
            style={btnStyle}
            onClick={onCancelRemovalConfirm}
          >
            <FontAwesome name="undo" />
          </Button>
        </div>
      )
    }
    return (<div />)
  }
}

export { RowControls }
