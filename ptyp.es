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

const GoalPairExtra = PropTypes.shape({
  remainingExp: PropTypes.number.isRequired,
  remainingBattles: PropTypes.arrayOf(PropTypes.number).isRequired,
})

const EGoalPair = PropTypes.shape({
  goal: Goal.isRequired,
  ship: Ship.isRequired,
  extra: GoalPairExtra.isRequired,
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
  level: PropTypes.oneOf([
    'all','ge-100','lt-99','under-final',
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

const ReasonAlts = {
  Remodel: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['remodel']),
    name: PropTypes.string,
    typeName: PropTypes.string,
  })),
  MaxUnmarried: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['max-unmarried']),
  })),
  MaxMarried: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['max-married']),
  })),
}

const Reason = PropTypes.oneOfType([
  ReasonAlts.Remodel,
  ReasonAlts.MaxUnmarried,
  ReasonAlts.MaxMarried,
])

const RGoalLevel = PropTypes.shape(allRequired({
  goalLevel: PropTypes.number,
  reason: Reason,
}))

const ShipPickerSorter = PropTypes.shape(allRequired({
  method: PropTypes.oneOf([
    'rid','stype','name','level','evasion','asw','los','fleet','lock',
  ]),
  reversed: PropTypes.bool,
}))

const GoalListSorter = PropTypes.shape(allRequired({
  method: PropTypes.oneOf([
    'rid','stype','level',
    'remaining-exp','remaining-battles-lb',
  ]),
  reversed: PropTypes.bool,
}))

const TemplateAlts = {
  Main: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['main']),
    method: Method,
  })),
  Custom: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['custom']),
    enabled: PropTypes.bool,
    stypes: PropTypes.arrayOf(PropTypes.number),
    method: Method,
  })),
}

const Template = PropTypes.oneOfType([
  TemplateAlts.Main,
  TemplateAlts.Custom,
])

const style = PropTypes.object

const Config = PropTypes.shape(allRequired({
  goalSorter: GoalListSorter,
  templates: PropTypes.arrayOf(Template),
}))

const PTyp = {
  ...PropTypes,
  allRequired,
  style,
  ternary,

  Ship,
  Goal,
  GoalPair,

  GoalPairExtra,
  EGoalPair,

  Rank,
  Method,
  KCMapString,
  BaseExp,
  ExpValue,
  ShipTypeInfo,
  ShipFilterTyps,
  ShipFilters,

  Reason,
  RGoalLevel,

  Template,

  ShipPickerSorter,
  GoalListSorter,

  Config,
}

export { PTyp }
