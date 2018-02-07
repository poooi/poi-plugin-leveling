import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { getPluginDirPath } from '../file-common'

const latestVersion = '2.0.0'

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
    const pStateFilePath = join(getPluginDirPath(), 'p-state.json')
    return updatePState(readJsonSync(pStateFilePath))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading p-state', err)
    }
  }
  return null
}

export { loadPState }
