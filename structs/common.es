// "expectObject(f,err)(x)" acts like "f(x)" given that "x" is indeed an object
// error will be reported through console.error otherwise.
const expectObject = f => x =>
  typeof x === 'object'
    ? f(x)
    : console.error(`Expecting an Object while value of type ${typeof x} is received`)

const reportTypeError = (cls,actualType) =>
  console.error(`Invalid ${cls.name} type: ${actualType}`)

export {
  expectObject,
  reportTypeError,
}
