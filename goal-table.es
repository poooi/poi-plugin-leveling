import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const latestVersion = '2.0.0'

// ensures goal table path exists, and returns goal table file name
const getGoalTablePath = admiralId => {
  const goalTablePath = join(APPDATA_PATH,'leveling')
  ensureDirSync(goalTablePath)
  return join(goalTablePath, `goal-table-${admiralId}.json`)
}


const saveGoalTable = (admiralId,gt) => {
  try {
    const filePath = getGoalTablePath(admiralId)
    const gtWithVer = {
      ...gt,
      $version: latestVersion,
    }
    writeJsonSync(filePath,gtWithVer)
  } catch (err) {
    console.error('Error while writing to goal table file', err)
  }
}

const updateGoalTable = oldGT => {
  // eslint-disable-next-line prefer-const
  let curGT = oldGT

  if (curGT.$version === latestVersion) {
    const {$version: _ignored, ...actualGT} = curGT
    return actualGT
  }

  throw new Error(`error while updating p-state`)
}

const loadGoalTable = admiralId => {
  try {
    return updateGoalTable(readJsonSync(getGoalTablePath(admiralId)))
  } catch (err) {
    // ignore error when it's about not finding the file, which is fine,
    // otherwise this could be a problem and we print it in this case.
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading goal table', err)
    }
  }
  return {}
}

export {
  saveGoalTable,
  loadGoalTable,
}
