import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  basicSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { initState } from '../store/init-state'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-leveling'),
  ext => _.isEmpty(ext) ? initState : ext
)

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
  mkExtPropSelector('goalsSelector')

const admiralIdSelector = createSelector(
  basicSelector,
  basic => {
    const raw = _.get(basic, 'api_member_id')
    // the conversion is safe, as we know it comes from game API
    return raw ? Number(raw) : null
  }
)

export {
  extSelector,
  uiSelector,
  templatesSelector,
  pReadySelector,
  goalsSelector,

  admiralIdSelector,
}
