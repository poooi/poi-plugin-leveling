import { createSelector, createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { shell } from 'electron'
import { modifyObject } from 'subtender'

import { PTyp } from '../../../ptyp'
import { uiSelector } from '../../../selectors'
import { mapDispatchToProps } from '../../../store'

const { __ } = window

// TODO: some really unnecessary lints are disabled for now
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */

const makeSorterSpec = (name,method,asc=true) =>
  ({name, method, asc})

const sorterSpecs = [
  makeSorterSpec(__('Sorter.ID'),'rid'),
  makeSorterSpec(__('Sorter.Type'),'stype'),
  makeSorterSpec(__('Sorter.Level'),'level',false),
  makeSorterSpec(__('Sorter.RemainingExp'),'remaining-exp'),
  makeSorterSpec(__('Sorter.RemainingBattles'),'remaining-battles-lb'),
]

class GoalSorterRowImpl extends Component {
  static propTypes = {
    sortMethod: PTyp.GoalListSorter.isRequired,
    uiModify: PTyp.func.isRequired,
  }

  handleClickSorter = method => () =>
    this.props.uiModify(
      modifyObject(
        'goalTab',
        modifyObject(
          'sortMethod',
          sortMethod => {
            if (sortMethod.method === method) {
              return {
                ...sortMethod,
                reversed: !sortMethod.reversed,
              }
            } else {
              return {
                method,
                reversed: false,
              }
            }
          }
        )
      )
    )

  handleOpenUserManual = () =>
    shell.openExternal(__('UserManual.Link'))

  render() {
    const { sortMethod } = this.props
    return (
      <div className="goal-sorter-row">
        {
          sorterSpecs.map( ({name,method,asc}) => {
            const isActive = sortMethod.method === method
            let content
            if (isActive) {
              // TODO: use FA, also make width stable
              const dir = sortMethod.reversed ? (asc ? '▼' : '▲') : (asc ? '▲' : '▼')
              content = `${name} ${dir}`
            } else {
              content = name
            }
            return (
              <Button
                onClick={this.handleClickSorter(method)}
                bsStyle={isActive ? "primary" : "default"}
                key={method}>{content}
              </Button>
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

const GoalSorterRow = connect(
  createStructuredSelector({
    // TODO: finer selectors
    sortMethod: createSelector(uiSelector, ui => ui.goalTab.sortMethod),
  }),
  mapDispatchToProps,
)(GoalSorterRowImpl)

export { GoalSorterRow }
