/*
   This module deals with migrating old plugin data directory into
   one used by version 2.0.0.

   For all versions after 2.0.0, updates should be handled
   by p-state and goal-table related modules.

   Note that this module only deals with files and never pass structured
   Objects to either p-state or goal-table related modules, as this part
   isn't really concerned about performance but about setting up the directory
   that is easier for p-state and goal-table to access and do their updates if needed.
*/
import nodeFS from 'fs'
import _ from 'lodash'
import { join } from 'path-extra'
import {
  readJsonSync,
  writeJsonSync,
  statSync,
  moveSync,
} from 'fs-extra'
import { modifyObject } from 'subtender'
import { mapStrToId } from 'subtender/kc'
import {
  getPluginDirPath, getBackupDirPath,
} from './file-common'
import { Method } from './structs'

const fileExists = path => {
  try {
    statSync(path)
    return true
  } catch (_e) {
    return false
  }
}

const updateMethod = method => {
  if (method.type === 'sortie') {
    return modifyObject(
      'baseExp',
      be =>
        (be.type === 'standard') ? ({
          type: 'standard',
          mapId: mapStrToId(be.map),
        }) : be
    )(method)
  } else {
    // must be type 'custom'
    return method
  }
}

const migrateLegacyGoalTable = goalTableInp => {
  const updateLegacyGoalTable = gt => {
    const updateLegacyMethod = Method.destruct({
      sortie: (flagship,_mvp,_rank,_baseExp,method) =>
        (
          // flagship used to be a bool, but it make sense to
          // have yes/no/maybe for it.
          ['yes','no','maybe'].includes(flagship) ?
            method : {
              ...method,
              flagship: method.flagship ? 'yes' : 'no',
            }
        ),
      custom: (_exp,method) => method,
    })

    const updateGoal = goal => ({
      ...goal,
      method: updateLegacyMethod(goal.method),
    })

    const ret = {}
    Object.keys(gt).map(rstIdStr => {
      ret[rstIdStr] = updateGoal(gt[rstIdStr])
    })
    return ret
  }

  const goalTable = updateLegacyGoalTable(goalTableInp)

  const newGoalTable = _.mapValues(
    goalTable,
    goal =>
      modifyObject('method', updateMethod)(goal)
  )

  return {
    ...newGoalTable,
    $version: '2.0.0',
  }
}

const migrateLegacyConfig = oldConf => {
  let {goalSorter, templates} = oldConf
  if (_.isEmpty(goalSorter)) {
    console.warn(`goalSorter shouldn't be empty, using default value ...`)
    goalSorter = {
      method: 'rid',
      reversed: false,
    }
  }

  if (!Array.isArray(templates) || templates.length === 0) {
    console.warn(`templates shouldn't be empty, using default value ...`)
    // default template list (**prior to** 2.0.0)
    templates = [{
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
  }

  const newTemplates = templates.map((template, ind) => {
    const newTemplate = modifyObject('method', updateMethod)(template)
    const id = template.type === 'main' ? 'main' : ind+1
    return {
      ...newTemplate,
      id,
    }
  })

  const pState = {
    ui: {
      activeTab: 'goal',
      goalTab: {
        sortMethod: goalSorter,
      },
    },
    templates: newTemplates,
    $version: '2.0.0',
  }
  return pState
}

/* eslint-disable camelcase */
const migrate = () => {
  const dirPath = getPluginDirPath()
  const pStateFilePath = join(dirPath, 'p-state.json')
  const configFilePath = join(dirPath, 'config.json')
  // step 1: if p-state.json exists, we are done.
  if (fileExists(pStateFilePath))
    return

  /*
     step 2:
     scan directory and deal with all files except 'config.json'
     we do this first to guarantee that, when 'p-state.json' exists,
     everything must have been updated properly.
   */
  const files = nodeFS.readdirSync(dirPath)
  files.map(fileOrDirName => {
    /*
       skip config.json as we want to deal with it later,
       also skip backup/ directory
     */
    if (fileOrDirName === 'config.json' || fileOrDirName === 'backup') {
      return
    }

    // update goal-table-<int>.json
    const reResult = /^goal-table-(\d+).json$/.exec(fileOrDirName)
    let processed = false
    if (reResult) {
      try {
        const path = join(dirPath, fileOrDirName)
        writeJsonSync(
          path,
          migrateLegacyGoalTable(readJsonSync(path)),
        )
        processed = true
      } catch (e) {
        console.error(`error while updating goal table file ${fileOrDirName}`, e)
      }
    }

    // move errored / unrecognized files into backup dir
    if (!processed) {
      const backupPath = getBackupDirPath()
      /*
         it's intentional not to have try-catch around for moveSync.
         because if it fails, the plugin should fail to prevent any further operation.
       */
      moveSync(
        join(dirPath, fileOrDirName),
        join(backupPath, fileOrDirName),
        {overwrite: true}
      )
    }
  })

  // step 3: update config.json into p-state.json if exists
  if (!fileExists(configFilePath))
    return

  try {
    writeJsonSync(
      pStateFilePath,
      migrateLegacyConfig(readJsonSync(configFilePath))
    )
  } catch (e) {
    console.error(`error while updating config.json into p-state.json`, e)
  }

  // step 4: move config.json into backup/
  moveSync(
    configFilePath,
    join(getBackupDirPath(), 'config.json')
  )

  /*
     after this is done, we should only have these things in plugin directory:
       - backup/ directory, optional if it turns out no backup is needed.
       - p-state.json, does not exist for new users
       - some updated goal-table-<int>.json files, could be none of course.
   */
}

export {
  migrate,
}
