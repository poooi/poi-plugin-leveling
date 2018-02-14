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
    shipTab: {
      filters: {
        fleet: 'all', // or 1,2,3,4 (number)
        type: 'all', // or stype (number)
        level: 'all', // or 'ge-100', 'lt-99', 'under-final'
        lock: 'all', // or true / false
      },
      sortMethod: {
        // every sorting method would have a "natural" order
        // which can either be ascending or descending,
        // we let the sorting method itself to decide which one
        // is more natural, and mark "reversed" as true only when
        // clicking on the same method twice
        // methods (all ascending unless explicitly says otherwise)
        // - rid
        // - stype
        // - name
        // - level, descending
        // - evasion
        // - asw
        // - los
        // - fleet
        // - lock
        method: 'level',
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
