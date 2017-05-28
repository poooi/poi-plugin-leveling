import {
  expectObject,
  reportTypeError,
} from './common'

class Reason {
  static destruct = ({remodel, maxUnmarried, maxMarried}) => expectObject(obj =>
      obj.type === 'remodel' ? remodel(obj.name,obj.typeName,obj)
    : obj.type === 'max-unmarried' ? maxUnmarried(obj)
    : obj.type === 'max-married' ? maxMarried(obj)
    : reportTypeError(Reason,obj.type))
}

export {
  Reason,
}
