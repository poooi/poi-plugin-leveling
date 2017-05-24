const fz = Object.freeze

const just = v => fz({
  type: 'just',
  value: v,
})
const nothing = fz({ type: 'nothing' })

const isMaybe = x => typeof x === 'object' && ['just','nothing'].indexOf(x.type) !== -1

const maybe = onNothing /* note: a thunk, call with "()" */ => onJust => obj => {
  if (isMaybe(obj)) {
    if (obj.type === 'nothing')
      return onNothing()
    else
      return onJust(obj.value)
  } else {
    console.error("expecting a maybe obj")
  }
}

export {
  just,
  nothing,
  isMaybe,
  maybe,
}
