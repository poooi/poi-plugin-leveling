import { shell } from 'electron'
import React, { PureComponent } from 'react'
import { Button } from 'react-bootstrap'
import { ExpTable } from './exp-table'

const { __ } = window.i18n["poi-plugin-leveling"]

class MiscArea extends PureComponent {
  handleOpenUserManual = () =>
    shell.openExternal(__('UserManual.Link'))

  render() {
    return (
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <h4>{__('UserManual.Desc')}</h4>
        <Button
          onClick={this.handleOpenUserManual}
          style={{paddingLeft: '2em', paddingRight: '2em'}}
        >
          Open
        </Button>
        <h4>Settings</h4>
        TODO
        <h4>Experience Table</h4>
        <ExpTable />
      </div>
    )
  }
}

export { MiscArea }
