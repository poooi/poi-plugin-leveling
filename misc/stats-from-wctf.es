const fs = require('fs-extra')
const request = require('request-promise-native')
const Datastore = require('nedb')

const WHOCALLSTHEFLEET_SHIPDB =
  'https://raw.githubusercontent.com/Diablohu/WhoCallsTheFleet-DB/master/db/ships.nedb'

const extractDocs = docs => {
  const dataObj = {}
  docs.map( doc => {
    const stat = {
      evasion: {
        base: doc.stat.evasion,
        max: doc.stat.evasion_max,
      },
      asw: {
        base: doc.stat.asw,
        max: doc.stat.asw_max,
      },
      los: {
        base: doc.stat.los,
        max: doc.stat.los_max,
      },
    }
    dataObj[doc.id] = stat
  })

  fs.writeJsonSync('./wctf_stats.json',dataObj)
}

const dbWalk = err => {
  if (err) throw err
  const db = new Datastore({filename: './ships.nedb'})

  db.loadDatabase(console.error)
  db.find({}, (err1, docs) => {
    if (err1) throw err1
    extractDocs(docs)
  })
}

request(WHOCALLSTHEFLEET_SHIPDB)
  .then( data => {
    fs.writeFile('./ships.nedb', data, dbWalk)
  })
  .catch(console.error)
