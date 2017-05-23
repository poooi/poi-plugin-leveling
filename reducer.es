

const initState = {
  admiralId: null,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-leveling@Init') {
    const { admiralId } = action

    return {
      ...state,
      admiralId,
    }
  }

  return state
}

const mapDispatchToProps = dispatch => ({
  onInitialize: admiralId => {
    dispatch({
      type: '@poi-plugin-leveling@Init',
      admiralId,
    })
  },
})

export {
  reducer,
  mapDispatchToProps,
}
