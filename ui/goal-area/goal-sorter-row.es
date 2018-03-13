import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { modifyObject } from 'subtender'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { sortMethodSelector } from './selectors'

const { __ } = window

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

  render() {
    const { sortMethod } = this.props
    return (
      <div
        style={{
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {
          sorterSpecs.map(({name,method,asc}) => {
            const isActive = sortMethod.method === method
            return (
              <Button
                style={{
                  marginTop: 0,
                  marginRight: 5,
                  minWidth: '10%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={this.handleClickSorter(method)}
                bsStyle={isActive ? 'primary' : 'default'}
                key={method}
              >
                <span>
                  {name}
                </span>
                {
                  isActive ? (
                    <FontAwesome
                      style={{width: '1.2em'}}
                      name={
                        sortMethod.reversed ? (
                          asc ? 'sort-desc' : 'sort-asc'
                        ) : (
                          asc ? 'sort-asc' : 'sort-desc'
                        )
                      }
                    />
                  ) : (
                    <span style={{width: '1.2em'}} />
                  )
                }
              </Button>
            )
          })
        }
      </div>)
  }
}

const GoalSorterRow = connect(
  createStructuredSelector({
    sortMethod: sortMethodSelector,
  }),
  mapDispatchToProps,
)(GoalSorterRowImpl)

export { GoalSorterRow }
