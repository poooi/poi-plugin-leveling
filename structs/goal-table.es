import {
  expectObject,
  reportTypeError,
} from './common'

class ExpValue {
  static destruct = (onSingle,onRange) => expectObject(obj =>
      obj.type === 'single' ? onSingle(obj.value,obj)
    : obj.type === 'range' ? onRange(obj.min,obj.max,obj)
    : reportTypeError(ExpValue,obj.type))
}

class BaseExp {
  static destruct = (onStandard,onCustom) => expectObject(obj =>
      obj.type === 'standard' ? onStandard(obj.map,obj)
    : obj.type === 'custom' ? onCustom(obj.value,obj)
    : reportTypeError(BaseExp,obj.type))
}

class Method {
  static destruct = (onSortie,onCustom) => expectObject(obj =>
      obj.type === 'sortie' ? onSortie(obj.flagship,obj.mvp,obj.rank,obj.baseExp,obj)
    : obj.type === 'custom' ? onCustom(obj.exp,obj)
    : reportTypeError(Method,obj.type))
}

export {
  ExpValue,
  BaseExp,
  Method,
}
