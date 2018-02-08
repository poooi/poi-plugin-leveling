const genSimpleDefaultTemplateList = () => [{
  type: 'main',
  method: {
    type: 'sortie',
    flagship: 'maybe',
    rank: ['S','A','B'],
    mvp: 'maybe',
    baseExp: {
      type: 'standard',
      mapId: 54,
    },
  },
  id: 'main',
}]

const initState = {
  ui: {
    // 'goal' or 'template'
    activeTab: 'goal',
    goalTab: {
      // originally named 'goalSorter'
      sortMethod: {
        method: 'rid',
        reversed: false,
      },
    },
  },
  // <TemplateList>
  templates: genSimpleDefaultTemplateList(),
  /*
     now p-state keeps the following two parts:

     - <store>.ui
     - <store>.templates

     and pReady indicates whether these two parts have been loaded properly.

     note that pReady also controls whether reducer would accept actions other than 'ready'
   */
  pReady: false,
  /*
     for keeping info for a specific admiralId.

     `admiralId` and `goalTable` has to be both `null` or both Objects
     at the same time to indicate whether this part of the store is ready

   */
  goals: {
    // null or <admiralId>
    admiralId: null,
    // null or <GoalTable>
    goalTable: null,
  },
}

export { initState }
