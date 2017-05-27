import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const getConfigFilePath = () => {
  const configPath = join(APPDATA_PATH,'leveling')
  ensureDirSync(configPath)
  return join(configPath,'config.json')
}


const loadConfig = () => {
  try {
    return readJsonSync(getConfigFilePath())
  } catch (err) {
    // ignore error when it's about not finding the file, which is fine,
    // otherwise this could be a problem and we print it in this case.
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading goal table', err)
    }
  }
  return {
    goalSorter: {
      method: 'rid',
      reversed: false,
    },
  }
}

const saveConfig = config => {
  try {
    writeJsonSync(getConfigFilePath(),config)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

export {
  loadConfig,
  saveConfig,
}
