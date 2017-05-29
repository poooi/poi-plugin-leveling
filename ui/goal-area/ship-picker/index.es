import React, { Component } from 'react'

import { ShipList } from './ship-list'
import { ShipFilter } from './ship-filter'

import { identity } from '../../../utils'
import { PTyp } from '../../../ptyp'
import { prepareFilter } from '../../../shiplist-ops'

// use first comparator, but if the first returns 0, use the second comparator instead
const composeComparator = (cmp1,cmp2) => (x,y) => {
  const result1 = cmp1(x,y)
  return result1 !== 0 ? result1 : cmp2(x,y)
}

const flipComparator = cmp => (x,y) => cmp(y,x)

// create a comparator assuming the getter projects a numeric value from elements
const getter2Comparator = getter => (x,y) => getter(x)-getter(y)

const prepareSorter = ({method,reversed}) => {
  const rosterIdComparator = getter2Comparator(x => x.rstId)

  const levelComparator =
    composeComparator(
      flipComparator(getter2Comparator(x => x.level)),
      composeComparator(
        getter2Comparator(x => x.sortNo),
        rosterIdComparator))

  const stypeComparator =
    composeComparator(
      flipComparator(getter2Comparator(x => x.stype)),
      composeComparator(
        getter2Comparator(x => x.sortNo),
        composeComparator(
          flipComparator(getter2Comparator(x => x.level)),
          getter2Comparator(x => x.rstId))))

  const comparator =
      method === 'rid' ? rosterIdComparator
    : method === 'stype' ? stypeComparator
    : method === 'name' ? getter2Comparator(x => x.name)
    : method === 'level' ? levelComparator
    : method === 'evasion' ? getter2Comparator(x => x.evasion)
    : method === 'asw' ? getter2Comparator(x => x.asw)
    : method === 'los' ? getter2Comparator(x => x.los)
    : method === 'fleet' ? getter2Comparator(x => x.fleet === null ? 0 : x.fleet)
    : method === 'lock' ? getter2Comparator(x => x.lock ? 1 : 0)
    : console.error(`Unknown sorting method: ${method}`)

  // as every ship has a unique rosterId
  // we use this as the final resolver if necessary
  // so that the compare result is always non-zero unless we are comparing the same ship
  const comparatorResolved = composeComparator(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.
  const doReverse = reversed ? xs => [...xs].reverse() : identity

  return xs => doReverse(xs.sort(comparatorResolved))
}

// a standalone part that allows user to do simple filtering and sorting
// on ships and picking ships for leveling.
class ShipPicker extends Component {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    templates: PTyp.arrayOf(PTyp.Template).isRequired,
    onModifyGoalTable: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      filters: {
        fleet: 'all', // or 1,2,3,4 (number)
        type: 'all', // or stype (number)
        level: 'all', // or 'ge-100', 'lt-99', 'under-final'
        lock: 'all', // or true / false
      },
      sorter: {
        // every sorting method would have a "natural" order
        // which can either be ascending or descending,
        // we let the sorting method itself to decide which one
        // is more natural, and mark "reversed" as true only when
        // clicking on the same method twice
        // methods (all ascending unless explicitly says otherwise)
        // - rid
        // - stype
        // - name
        // - level, descending
        // - evasion
        // - asw
        // - los
        // - fleet
        // - lock
        method: 'level',
        reversed: false,
      },
    }
  }

  handleModifyFilters = modifier =>
    this.setState(state => ({
      ...state,
      filters: modifier(state.filters),
    }))

  handleModifySorter = modifier =>
    this.setState(state => ({
      ...state,
      sorter: modifier(state.sorter),
    }))

  render() {
    const filter = prepareFilter(this.state.filters)
    const sorter = prepareSorter(this.state.sorter)

    const originalShips = this.props.ships
    const stypeSet = new Set()
    originalShips.map( s => {
      stypeSet.add(s.stype)
    })
    const stypes = [...stypeSet].sort((x,y) => x-y)
    const ships = sorter(filter(originalShips))
    return (
      <div>
        <ShipFilter
            onModifyFilters={this.handleModifyFilters}
            filters={this.state.filters}
            stypeInfo={this.props.stypeInfo}
            stypes={stypes} />
        <ShipList
            onModifyGoalTable={this.props.onModifyGoalTable}
            onModifySorter={this.handleModifySorter}
            templates={this.props.templates}
            sorter={this.state.sorter}
            ships={ships} />
      </div>
    )
  }
}

export { ShipPicker }
