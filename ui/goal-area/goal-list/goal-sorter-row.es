import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { shell } from 'electron'

import { PTyp } from '../../../ptyp'

const { __ } = window

class GoalSorterRow extends Component {
  static makeSorterSpec = (name,method,asc=true) =>
    ({ name, method, asc })
  static sorterSpecs = [
    GoalSorterRow.makeSorterSpec(__('Sorter.ID'),'rid'),
    GoalSorterRow.makeSorterSpec(__('Sorter.Type'),'stype'),
    GoalSorterRow.makeSorterSpec(__('Sorter.Level'),'level',false),
    GoalSorterRow.makeSorterSpec(__('Sorter.RemainingExp'),'remaining-exp'),
    GoalSorterRow.makeSorterSpec(__('Sorter.RemainingBattles'),'remaining-battles-lb'),
  ]

  static propTypes = {
    sorter: PTyp.GoalListSorter.isRequired,
    onModifySorter: PTyp.func.isRequired,
  }

  handleClickSorter = method => () => {
    const { onModifySorter } = this.props
    onModifySorter( sorter => {
      if (sorter.method === method)
        return {
          ...sorter,
          reversed: !sorter.reversed,
        }
      else
        return {
          method,
          reversed: false,
        }
    })
  }

  handleOpenUserManual = () =>
    shell.openExternal(__('UserManual.Link'))

  render() {
    const { sorter } = this.props
    return (
      <div className="goal-sorter-row">
        {
          GoalSorterRow.sorterSpecs.map( ({name,method,asc}) => {
            const isActive = sorter.method === method
            let content
            if (isActive) {
              const dir = sorter.reversed ? (asc ? '▼' : '▲') : (asc ? '▲' : '▼')
              content = `${name} ${dir}`
            } else {
              content = name
            }
            return (
              <Button
                  onClick={this.handleClickSorter(method)}
                  bsStyle={isActive ? "primary" : "default"}
                  key={method}>{content}</Button>
            )
          })
        }
        <a
            onClick={this.handleOpenUserManual}
            style={{
              marginLeft: 'auto',
              fontSize: '1.2em',
            }}
        >
          {__('UserManual.Desc')}
        </a>
      </div>)
  }
}

export { GoalSorterRow }
