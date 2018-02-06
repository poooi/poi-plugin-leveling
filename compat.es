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

/*
   TODO:
   migration.

   this should also take care of old goal-table in addition to config

   - if p-state.json exists, we are done.
   - otherwise, we are facing either an empty directory or a legacy one.
   - scan directory, for each file:
     - if it's `config.json`, skip it for now.
     - if it matches `goal-table-<int>.json` and update them accordingly.
       move them into backup directory upon error.
     - for all other files, move them into backup directory.
     - we assume that user will never manipuate plugin dir
       so all directories are maintained by this plugin.
       prior to 2.0.0, there is no attempt at creating subdirectories
       so this migration strategy is safe.
     - after this pass, we should only have these things in plugin directory:
       - backup/ directory, optional if it turns out no backup is needed.
       - config.json, does not exist for new users
       - some updated goal-table-<int>.json files, could be none of course.
   - now we start updating config.json (if it exists) into p-state

   maybe we just name this '<project root>/compat.es'

 */

/* eslint-disable camelcase */
const migrateFromPriorTo_v2_0_0 = () => {
  
}

export {
  migrateFromPriorTo_v2_0_0,
}
