import { PropTypes } from 'prop-types'

const _ = require('lodash')

// PTyp is just short for PropTypes.
// In addition, this allows us to collect validation logic
// in one place

const allRequired = shapeObj => {
  const ret = {}
  Object.keys(shapeObj).map(k => {
    const original = shapeObj[k]
    ret[k] = typeof original.isRequired !== 'undefined'
      ? original.isRequired
      : PropTypes.oneOfType([original]).isRequired
  })
  return ret
}

const ternary = PropTypes.oneOf(['yes','no','maybe'])

const Ship = PropTypes.shape({
  ...allRequired({
    rstId: PropTypes.number,
    typeName: PropTypes.string,
    stype: PropTypes.number,
    name: PropTypes.string,
    level: PropTypes.number,
    evasion: PropTypes.number,
    asw: PropTypes.number,
    los: PropTypes.number,
    locked: PropTypes.bool,
    expToNext: PropTypes.number,
    totalExp: PropTypes.number,
    sortNo: PropTypes.number,
  }),
  // could be null, therefore not required
  fleet: PropTypes.number,
  nextRemodelLevel: PropTypes.number,
})

const ExpValueAlts = {
  Single: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['single']),
    value: PropTypes.number,
  })),
  Range: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['range']),
    min: PropTypes.number,
    max: PropTypes.number,
  })),
}

const ExpValue = PropTypes.oneOfType([
  ExpValueAlts.Single,
  ExpValueAlts.Range,
])

const Rank = (props, propName, componentName) => {
  let reason = null
  const rank = props[propName]
  if (!Array.isArray(rank) || rank.length < 1)
    reason = 'expecting an instance of non-empty Array'

  if (reason === null && rank.some(x => "SABCDE".indexOf(x) === -1))
    reason = 'all rank element should be one of S/A/B/C/D/E'

  if (reason === null && _.uniq(rank).length !== rank.length)
    reason = 'all rank elements need to be unique'

  if (reason !== null)
    return new Error(
      `Invalid prop \`${propName}\` supplied to` +
      ` \`${componentName}\` (reason: ${reason}). Validation failed.`
    )
}

const KCMapString = (props, propName, componentName) => {
  if (! /^\d+-\d+$/.test(props[propName]))
    return new Error(
      `Invalid prop \`${propName}\` supplied to` +
      ` \`${componentName}\`. Validation failed.`
    )
}

const BaseExpAlts = {
  Standard: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['standard']),
    map: KCMapString,
  })),
  Custom: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['custom']),
    value: ExpValue,
  })),
}

const BaseExp = PropTypes.oneOfType([
  BaseExpAlts.Standard,
  BaseExpAlts.Custom,
])

const MethodAlts = {
  Sortie: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['sortie']),
    flagship: ternary,
    mvp: ternary,
    rank: Rank,
    baseExp: BaseExp,
  })),
  Custom: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['custom']),
    exp: ExpValue,
  })),
}

const Method = PropTypes.oneOfType([
  MethodAlts.Sortie,
  MethodAlts.Custom,
])

const Goal = PropTypes.shape(allRequired({
  rosterId: PropTypes.number,
  goalLevel: PropTypes.number,
  method: Method,
}))

const GoalPair = PropTypes.shape({
  goal: Goal.isRequired,
  ship: Ship.isRequired,
})

const ShipTypeInfo = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }))

const ShipFilterTyps = {
  fleet: PropTypes.oneOf(['all',1,2,3,4]),
  type: PropTypes.oneOfType([
    PropTypes.oneOf(['all']),
    PropTypes.number,
  ]),
  level: PropTypes.oneOfType([
    PropTypes.oneOf(['all']),
    PropTypes.number,
  ]),
  lock: PropTypes.oneOfType([
    PropTypes.oneOf(['all']),
    PropTypes.bool,
  ]),
}

const ShipFilters = PropTypes.shape(allRequired({
  fleet: ShipFilterTyps.fleet,
  type: ShipFilterTyps.type,
  level: ShipFilterTyps.level,
  lock: ShipFilterTyps.lock,
}))

const PTyp = {
  ...PropTypes,
  allRequired,
  ternary,
  Ship,
  Goal,
  GoalPair,
  Rank,
  Method,
  KCMapString,
  BaseExp,
  ExpValue,
  ShipTypeInfo,
  ShipFilterTyps,
  ShipFilters,
}

export { PTyp }
