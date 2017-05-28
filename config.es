import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { konst } from './utils'

const { APPDATA_PATH } = window

const genSimpleDefaultTemplateList = () => [{
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

const loadDefaultTemplateList = () => {
  try {
    return readJsonSync(join(__dirname, 'assets', 'default-template-list.json'))
  } catch (e) {
    console.error(`error while loading default template list: ${e}`)
    return genSimpleDefaultTemplateList()
  }
}

const patchTemplates = config => {
  if (! Array.isArray(config.templates) || config.templates.length === 0) {
    return {
      ...config,
      templates: loadDefaultTemplateList(),
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
  let ret = {
    goalSorter: {
      method: 'rid',
      reversed: false,
    },
  }

  try {
    ret = readJsonSync(getConfigFilePath())
  } catch (err) {
    // ignore error when it's about not finding the file, which is fine,
    // otherwise this could be a problem and we print it in this case.
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading goal table', err)
    }
  }

  return patchTemplates(ret)
}

const saveConfig = config => {
  try {
    writeJsonSync(getConfigFilePath(),config)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

// TODO: we need to find a consistent place for data structure that has been
// specified by documents...
// matchTemplate(<template>)(stype) => a boolean indicating whether current
// template matches it.
const matchTemplate = template => {
  if (template.type === 'main')
    return konst(true)

  if (template.type === 'custom')
    return stype => template.stypes.indexOf(stype) !== -1

  console.error(`Unknown template type: ${template.type}`)
}

export {
  loadConfig,
  saveConfig,
  loadDefaultTemplateList,
  matchTemplate,
}
