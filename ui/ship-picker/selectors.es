import { createSelector } from 'reselect'
import {
  uiSelector,
  shipsInfoSelector,
  goalTableSelector,
} from '../../selectors'

import { prepareFilter, prepareSorter } from '../../shiplist-ops'

const shipTabSelector = createSelector(
  uiSelector,
  ui => ui.shipTab
)

const shipListStage1Selector = createSelector(
  shipsInfoSelector,
  goalTableSelector,
  (ships, gt) => ships.filter(s => !(s.rstId in gt))
)

const filtersSelector = createSelector(
  shipTabSelector,
  s => s.filters
)

const sortMethodSelector = createSelector(
  shipTabSelector,
  s => s.sortMethod
)

const shipListSelector = createSelector(
  shipListStage1Selector,
  filtersSelector,
  sortMethodSelector,
  (ships, filters, sortMethod) => {
    const filter = prepareFilter(filters)
    const sort = prepareSorter(sortMethod)
    return sort(filter(ships))
  }
)

export {
  shipTabSelector,
  shipListSelector,
  filtersSelector,
  sortMethodSelector,
}
