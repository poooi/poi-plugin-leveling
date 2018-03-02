/*
   This module contains functions and structures related to ship lists
 */
import _ from 'lodash'
import {
  chainComparators,
  projectorToComparator,
  flipComparator,
} from 'subtender'

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

const rosterIdComparator = projectorToComparator(x => x.rstId)

// when supplied to sort function, the result will be like
// sorting by ship levels in game.
const inGameLevelComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.level)),
    projectorToComparator(x => x.sortNo),
    rosterIdComparator)

// when supplied to sort function, the result will be like
// sorting by ship types in game.
const inGameShipTypeComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.stype)),
    projectorToComparator(x => x.sortNo),
    flipComparator(projectorToComparator(x => x.level)),
    rosterIdComparator)

const prepareSorter = ({method,reversed}) => {
  const comparator =
      method === 'rid' ? rosterIdComparator
    : method === 'stype' ? inGameShipTypeComparator
    : method === 'name' ? projectorToComparator(x => x.name)
    : method === 'level' ? inGameLevelComparator
    : method === 'evasion' ? projectorToComparator(x => x.evasion)
    : method === 'asw' ? projectorToComparator(x => x.asw)
    : method === 'los' ? projectorToComparator(x => x.los)
    : method === 'fleet' ? projectorToComparator(x => x.fleet === null ? 0 : x.fleet)
    : method === 'lock' ? projectorToComparator(x => x.lock ? 1 : 0)
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
  chainComparators,
  flipComparator,
  projectorToComparator,

  rosterIdComparator,
  inGameLevelComparator,
  inGameShipTypeComparator,

  prepareSorter,
}
