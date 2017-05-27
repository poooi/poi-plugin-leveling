import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import { PTyp } from '../../ptyp'

class GoalSorterRow extends Component {
  static makeSorterSpec = (name,method,asc=true) =>
    ({ name, method, asc })
  static sorterSpecs = [
    GoalSorterRow.makeSorterSpec('Id','rid'),
    GoalSorterRow.makeSorterSpec('Type','stype'),
    GoalSorterRow.makeSorterSpec('Level','level',false),
    GoalSorterRow.makeSorterSpec('Remaining Exp','remaining-exp'),
    GoalSorterRow.makeSorterSpec('Remaining Battles','remaining-battles-lb'),
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
      </div>)
  }
}

export { GoalSorterRow }
