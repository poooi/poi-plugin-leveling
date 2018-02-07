import _ from 'lodash'
import { join } from 'path-extra'
import {
  ensureDirSync,
} from 'fs-extra'

const { APPDATA_PATH } = window

const getPluginDirPath = _.memoize(() => {
  const dirPath = join(APPDATA_PATH, 'leveling')
  ensureDirSync(dirPath)
  return dirPath
})

const getBackupDirPath = _.memoize(() => {
  const dirPath = getPluginDirPath()
  const backupPath = join(dirPath, 'backup')
  ensureDirSync(backupPath)
  return backupPath
})

export {
  getPluginDirPath,
  getBackupDirPath,
}
