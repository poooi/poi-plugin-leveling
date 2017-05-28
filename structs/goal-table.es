import {
  expectObject,
  reportTypeError,
} from './common'

class Ternary {
  static destruct = ({yes,no,maybe}) => x =>
      x === 'yes' ? yes(x)
    : x === 'no' ? no(x)
    : x === 'maybe' ? maybe(x)
    : console.error(`Expecting one of 'yes' 'no' 'maybe' while getting ${x}`)
  static toArray = Ternary.destruct({
    yes: () => [true],
    no: () => [false],
    maybe: () => [false,true],
  })

  static toString = Ternary.destruct({
    yes: () => '✓',
    no: () => '❌',
    maybe: () => '✓/❌',
  })
}

class ExpValue {
  static destruct = ({single,range}) => expectObject(obj =>
      obj.type === 'single' ? single(obj.value,obj)
    : obj.type === 'range' ? range(obj.min,obj.max,obj)
    : reportTypeError(ExpValue,obj.type))
  static toArray = ExpValue.destruct({
    single: value => [value],
    range: (min,max) => [min,max],
  })
  static toString = ExpValue.destruct({
    single: value => `${value}`,
    range: (min,max) => `${min} ~ ${max}`,
  })
}

class BaseExp {
  static destruct = ({standard,custom}) => expectObject(obj =>
      obj.type === 'standard' ? standard(obj.map,obj)
    : obj.type === 'custom' ? custom(obj.value,obj)
    : reportTypeError(BaseExp,obj.type))
  static toExpValueWithGetter = mapExpGetter =>
    BaseExp.destruct({
      standard: map => mapExpGetter(map),
      custom: value => value,
    })
}

class Rank {
  static values = 'SABCDE'.split('')
  static normalize = ranks =>
    Rank.values.filter(r => ranks.indexOf(r) !== -1)
}

class Method {
  static destruct = ({sortie,custom}) => expectObject(obj =>
      obj.type === 'sortie' ? sortie(obj.flagship,obj.mvp,obj.rank,obj.baseExp,obj)
    : obj.type === 'custom' ? custom(obj.exp,obj)
    : reportTypeError(Method,obj.type))
}

export {
  Ternary,
  ExpValue,
  BaseExp,
  Rank,
  Method,
}
