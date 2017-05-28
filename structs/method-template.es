import {
  expectObject,
  reportTypeError,
} from './common'

class Template {
  static destruct = ({main,custom}) => expectObject(obj =>
      obj.type === 'main' ? main(obj.method,obj)
    : obj.type === 'custom' ? custom(obj.method,obj.enabled,obj.stypes)
    : reportTypeError(Template,obj.type))

  // Template.match(<template>)(<ship type>) => bool
  static match = Template.destruct({
    main: () => (/* stype (ignored) */) => true,
    custom: (method,enabled,stypes) =>
      stype => stypes.indexOf(stype) !== -1,
  })
}

class TemplateList {
  static validate = obj => {
    if (!Array.isArray(obj)) {
      console.error(`Expecting an Array while value of type ${typeof obj} is received`)
      return false
    }
    if (obj.length === 0) {
      console.error(`TemplateList should be non empty`)
      return false
    }
    const isValid = obj.every( (x,ind) => {
      if (ind+1 === obj.length) {
        return x.type === 'main'
      } else {
        return x.type === 'custom'
      }
    })
    if (!isValid) {
      console.error([
        "Either last element is not the main template,",
        "or there are non-custom templates in other positions",
        "in TemplateList",
      ].join(' '))
      return false
    }
    return obj
  }

  static destruct = (f,needsValidate=false) => obj => {
    if (needsValidate && !TemplateList.validate(obj))
      return

    const customs = [...TemplateList]
    const main = customs.pop()
    return f(customs,main)
  }
}

export {
  Template,
  TemplateList,
}
