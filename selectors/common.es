/*
   common selectors are selectors that require minimum
   dependencies to work, this includes:

   - direct store accessors
   - data that can directly drived from store

 */
import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  basicSelector,
  wctfSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { minimum } from '../default-template-list'
import { initState } from '../store/init-state'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  ext => _.isEmpty(ext) ? initState : ext
)

{
  // debugging util
  const {getStore} = window
  window.getExt = () => extSelector(getStore())
}

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName])
)

const uiSelector =
  mkExtPropSelector('ui')
const templatesSelector =
  mkExtPropSelector('templates')
const pReadySelector =
  mkExtPropSelector('pReady')
const goalsSelector =
  mkExtPropSelector('goals')

const goalsAdmiralIdSelector = createSelector(
  goalsSelector,
  g => g.admiralId
)

// internal only, please use goalTableSelector.
const goalsGoalTableSelector = createSelector(
  goalsSelector,
  g => g.goalTable
)

const admiralIdSelector = createSelector(
  basicSelector,
  basic => {
    const raw = _.get(basic, 'api_member_id')
    // the conversion is safe, as we know it comes from game API
    return raw ? Number(raw) : null
  }
)

/*
   check whether <extStore>.goals is ready:
   for it to be ready, admiralId must be vaild and match current admiralId
 */
const goalsReadySelector = createSelector(
  goalsAdmiralIdSelector,
  admiralIdSelector,
  (goalsAdmiralId, admiralId) =>
    goalsAdmiralId && admiralId && goalsAdmiralId === admiralId
)

const goalTableSelector = createSelector(
  goalsGoalTableSelector,
  goalsReadySelector,
  (goalTable, ready) => ready ? goalTable : {}
)

const shipStatsAtLevelFuncSelector = createSelector(
  wctfSelector,
  wctf => _.memoize(mstId => {
    const statInfo = _.get(wctf,['ships',mstId,'stat'])
    if (!statInfo) {
      return _level => ({evasion: null, asw: null, los: null})
    } else {
      return level =>
        _.fromPairs(
          ['evasion', 'asw', 'los'].map(statName => {
            const stBase = statInfo[statName]
            const stMax = statInfo[`${statName}_max`]
            let statVal = null
            if (
              _.isInteger(stBase) && stBase >= 0 &&
              _.isInteger(stMax) && stMax >= 0
            ) {
              statVal = stBase + Math.floor((stMax - stBase) * level / 99)
            }
            return [statName, statVal]
          })
        )
    }
  })
)

const templateListSelector = createSelector(
  pReadySelector,
  templatesSelector,
  (pReady, templates) =>
    pReady ? templates : minimum
)

export {
  extSelector,
  uiSelector,
  templatesSelector,
  templateListSelector,
  pReadySelector,

  admiralIdSelector,
  shipStatsAtLevelFuncSelector,
  goalsReadySelector,
  goalTableSelector,
}
