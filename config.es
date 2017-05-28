import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const generateDefaultTemplateList = () => [{
  type: 'main',
  method: {
    type: 'sortie',
    flagship: 'maybe',
    rank: ['S','A','B'],
    mvp: 'maybe',
    baseExp: {
      type: 'standard',
      map: '5-4',
    },
  },
}]

const patchTemplates = config => {
  if (! Array.isArray(config.templates) || config.templates.length === 0) {
    return {
      ...config,
      templates: generateDefaultTemplateList(),
    }
  }
  return config
}

const getConfigFilePath = () => {
  const configPath = join(APPDATA_PATH,'leveling')
  ensureDirSync(configPath)
  return join(configPath,'config.json')
}

const loadConfig = () => {
  try {
    return patchTemplates(readJsonSync(getConfigFilePath()))
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
