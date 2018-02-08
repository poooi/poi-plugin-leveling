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
  /*
     when pReady is true, this part must be <TemplateList>,
     otherwise it's nullable.

     avoid direct access to this and use templateListSelector.
   */
  templates: null,
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
    /*
       note: this part is not meant to be accessed directly,
       it's recommended to use goalTableSelector,
       which makes sure admiralId matches.
     */
    goalTable: null,
  },
}

export { initState }
