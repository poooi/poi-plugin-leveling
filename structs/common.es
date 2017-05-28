// "expectObject(f,err)(x)" acts like "f(x)" given that "x" is indeed an object
// error will be reported through console.error otherwise.
const expectObject = f => x =>
  typeof x === 'object'
    ? f(x)
    : console.error(`Expecting an Object while value of type ${typeof x} is received`)

const expectTernary = f => x =>
  ['yes','no','maybe'].indexOf(x) !== -1
    ? f(x)
    : console.error(`Expecting one of 'yes' 'no' 'maybe' while getting ${x}`)

const reportTypeError = (cls,actualType) =>
  console.error(`Invalid ${cls.name} type: ${actualType}`)

export {
  expectObject,
  expectTernary,
  reportTypeError,
}
