import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

/*

   TODO: for replacing reducer.es

 */

const genSimpleDefaultTemplateList = () => [{
  type: 'main',
  method: {
    type: 'sortie',
    flagship: 'maybe',
    rank: ['S','A','B'],
    mvp: 'maybe',
    baseExp: {
      type: 'standard',
      mapId: 54,
    },
  },
  id: 'main',
}]

const initState = {
  ui: {
    // 'goal' or 'template'
    activeTab: 'goal',
    goalTab: {
      // originally named 'goalSorter'
      sortMethod: {
        method: 'rid',
        reversed: false,
      },
    },
  },
  // <TemplateList>
  templates: genSimpleDefaultTemplateList(),
  /*
     now p-state keeps the following two parts:

     - <store>.ui
     - <store>.templates

     and pReady indicates whether these two parts have been loaded properly.

     note that pReady also controls whether reducer would accept actions other than 'ready'
   */
  pReady: false,
  /*
     for keeping info for a specific admiralId.

     `admiralId` and `goalTable` has to be both `null` or both Objects
     at the same time to indicate whether this part of the store is ready

   */
  goals: {
    // null or <admiralId>
    admiralId: null,
    // null or <GoalTable>
    goalTable: null,
  },
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-leveling@ready') {
    const {pState} = action
    return {
      ...state,
      ...pState,
      pReady: true,
    }
  }

  if (!state.pReady)
    return state

  if (action.type === '@poi-plugin-leveling@modify') {
    const {modifier} = action
    return modifier(state)
  }

  return state
}

const actionCreators = {
  ready: pStateOrNull => {
    const templates = _.get(pStateOrNull, 'templates')
    const ui = _.get(pStateOrNull, 'ui')

    const pState = {}
    if (!_.isEmpty(templates))
      pState.templates = templates
    if (!_.isEmpty(ui))
      pState.ui = ui

    return {
      type: '@poi-plugin-leveling@ready',
      pState,
    }
  },
  modify: modifier => ({
    type: '@poi-plugin-leveling@modify',
    modifier,
  }),
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreators, dispatch))

const boundActionCreators = mapDispatchToProps(store.dispatch)

export {
  initState,
  reducer,
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
}
