/*
   This module contains functions and structures related to ship lists
 */
import { identity } from './utils'

const _ = require('lodash')

const prepareFilter = filters => {
  const { fleet, type, level, lock } = filters
  const mkFilter = pred => ship => ship.filter(pred)

  const fleetFilter =
      fleet === 'all' ? identity
    : (fleet >= 1 && fleet <= 4) ? mkFilter(ship => ship.fleet === fleet)
    : console.error(`Invalid fleet filter: ${fleet}`)

  const typeFilter =
      type === 'all' ? identity
    : typeof type === 'number' ? mkFilter(ship => ship.stype === type)
    : console.error(`Invalid type filter: ${type}`)

  const levelFilter =
      level === 'all' ? identity
    : level === 'ge-100' ? mkFilter(ship => ship.level >= 100)
    : level === 'lt-99' ? mkFilter(ship => ship.level < 99)
    : level === 'under-final' ? mkFilter(ship => ship.nextRemodelLevel !== null)
    : console.error(`Invalid level filter: ${level}`)

  const lockFilter =
      lock === 'all' ? identity
    : lock === true ? mkFilter(ship => ship.locked)
    : lock === false ? mkFilter(ship => !ship.locked)
    : console.error(`Invalid lock filter: ${lock}`)

  // filter that potentially removes more items than others goes first
  return _.flow([fleetFilter, typeFilter, levelFilter, lockFilter])
}

const describeFilterWith = stypeInfo => filterName => {
  if (filterName === 'type')
    return tNum => {
      if (tNum === 'all')
        return 'All'

      const stInd = stypeInfo.findIndex( ({id}) => id === tNum )
      return stInd === -1 ? tNum : `${stypeInfo[stInd].name} (${tNum})`
    }

  if (filterName === 'level')
    return l =>
        l === 'all' ? 'All'
      : l === 'ge-100' ? '≥ 100'
      : l === 'lt-99' ? '< 99'
      : l === 'under-final' ? '< F. Rmdl.'
      : l

  if (filterName === 'fleet')
    return fNum => fNum === 'all' ? 'All' : `Fleet ${fNum}`

  if (filterName === 'lock')
    return v => v === 'all' ? 'All' : (v ? 'Locked' : 'Unlocked')
  return x => x
}

export {
  prepareFilter,
  describeFilterWith,
}
