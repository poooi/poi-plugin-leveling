/*
   This module contains functions and structures related to ship lists
 */
import _ from 'lodash'

const prepareFilter = filters => {
  const { fleet, type, level, lock } = filters
  const mkFilter = pred => ship => ship.filter(pred)

  const fleetFilter =
      fleet === 'all' ? _.identity
    : (fleet >= 1 && fleet <= 4) ? mkFilter(ship => ship.fleet === fleet)
    : console.error(`Invalid fleet filter: ${fleet}`)

  const typeFilter =
      type === 'all' ? _.identity
    : typeof type === 'number' ? mkFilter(ship => ship.stype === type)
    : console.error(`Invalid type filter: ${type}`)

  const levelFilter =
      level === 'all' ? _.identity
    : level === 'ge-100' ? mkFilter(ship => ship.level >= 100)
    : level === 'lt-99' ? mkFilter(ship => ship.level < 99)
    : level === 'under-final' ? mkFilter(ship => ship.nextRemodelLevel !== null)
    : console.error(`Invalid level filter: ${level}`)

  const lockFilter =
      lock === 'all' ? _.identity
    : lock === true ? mkFilter(ship => ship.locked)
    : lock === false ? mkFilter(ship => !ship.locked)
    : console.error(`Invalid lock filter: ${lock}`)

  // filter that potentially removes more items than others goes first
  return _.flow([fleetFilter, typeFilter, levelFilter, lockFilter])
}

const describeFilterWith = (stypeInfo,__) => filterName => {
  const trAll = __('Filter.All')
  if (filterName === 'type')
    return tNum => {
      if (tNum === 'all')
        return trAll

      const stInd = stypeInfo.findIndex( ({id}) => id === tNum )
      return stInd === -1 ? tNum : `${stypeInfo[stInd].name} (${tNum})`
    }

  if (filterName === 'level')
    return l =>
      l === 'all' ? trAll :
      l === 'ge-100' ? '≥ 100' :
      l === 'lt-99' ? '< 99' :
      l === 'under-final' ? __('Filter.UnderFinalRemodelLevelShort') :
      l

  if (filterName === 'fleet')
    return fNum => fNum === 'all' ? trAll : __('Filter.FleetX',fNum)

  if (filterName === 'lock')
    return v => v === 'all' ? trAll : (v ? __('Filter.Locked') : __('Filter.Unlocked'))
  return x => x
}

// composing multiple comparators into one by
// trying comparators from left to right, and return first non-zero value.
// if no comparator is provided or all comparator has return 0
// the resulting comparator returns 0 as well.
const chainComparators = (...cmps) => (x,y) => {
  for (let i=0; i<cmps.length; ++i) {
    const result = cmps[i](x,y)
    if (result !== 0)
      return result
  }
  return 0
}

const flipComparator = cmp => (x,y) => cmp(y,x)

// create a comparator assuming the getter projects a numeric value from elements
const getter2Comparator = getter => (x,y) => getter(x)-getter(y)

const rosterIdComparator = getter2Comparator(x => x.rstId)

// when supplied to sort function, the result will be like
// sorting by ship levels in game.
const inGameLevelComparator =
  chainComparators(
    flipComparator(getter2Comparator(x => x.level)),
    getter2Comparator(x => x.sortNo),
    rosterIdComparator)

// when supplied to sort function, the result will be like
// sorting by ship types in game.
const inGameShipTypeComparator =
  chainComparators(
    flipComparator(getter2Comparator(x => x.stype)),
    getter2Comparator(x => x.sortNo),
    flipComparator(getter2Comparator(x => x.level)),
    rosterIdComparator)

const prepareSorter = ({method,reversed}) => {
  const comparator =
      method === 'rid' ? rosterIdComparator
    : method === 'stype' ? inGameShipTypeComparator
    : method === 'name' ? getter2Comparator(x => x.name)
    : method === 'level' ? inGameLevelComparator
    : method === 'evasion' ? getter2Comparator(x => x.evasion)
    : method === 'asw' ? getter2Comparator(x => x.asw)
    : method === 'los' ? getter2Comparator(x => x.los)
    : method === 'fleet' ? getter2Comparator(x => x.fleet === null ? 0 : x.fleet)
    : method === 'lock' ? getter2Comparator(x => x.lock ? 1 : 0)
    : console.error(`Unknown sorting method: ${method}`)

  // as every ship has a unique rosterId
  // we use this as the final resolver if necessary
  // so that the compare result is always non-zero unless we are comparing the same ship
  const comparatorResolved = chainComparators(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.
  const doReverse = reversed ? xs => [...xs].reverse() : _.identity

  return xs => doReverse(xs.sort(comparatorResolved))
}

export {
  prepareFilter,
  describeFilterWith,

  chainComparators,
  flipComparator,
  getter2Comparator,

  rosterIdComparator,
  inGameLevelComparator,
  inGameShipTypeComparator,

  prepareSorter,
}
