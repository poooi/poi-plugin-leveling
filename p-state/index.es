import {
  readJsonSync,
  writeJsonSync,
} from 'fs-extra'
import { join } from 'path-extra'
import { createSelector } from 'reselect'

import { getPluginDirPath } from '../file-common'
import {
  uiSelector,
  templatesSelector,
} from '../selectors/common'

const latestVersion = '2.0.0'

const getPStateFilePath = () =>
  join(getPluginDirPath(), 'p-state.json')

const pStateSelector = createSelector(
  uiSelector,
  templatesSelector,
  (ui, templates) => ({ui, templates})
)

const savePState = pState => {
  const path = getPStateFilePath()
  try {
    const pStateWithVer = {
      ...pState,
      $version: latestVersion,
    }
    writeJsonSync(path,pStateWithVer)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

const updatePState = oldPState => {
  // eslint-disable-next-line prefer-const
  let curPState = oldPState

  if (curPState.$version === latestVersion) {
    const {$version: _ignored, ...actualPState} = curPState
    return actualPState
  }

  throw new Error(`error while updating p-state`)
}

const loadPState = () => {
  try {
    const pStateFilePath = getPStateFilePath()
    return updatePState(readJsonSync(pStateFilePath))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading p-state', err)
    }
  }
  return null
}

export {
  pStateSelector,
  savePState,
  loadPState,
}
