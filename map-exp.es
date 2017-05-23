import { readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const mapExpTable = readJsonSync(join(__dirname, 'assets', 'map_exp.json'))
const getMapExpInfo = map => mapExpTable[map]

export { getMapExpInfo }
