const {remote} = require('electron')

window.ROOT = remote.getGlobal('ROOT')
window.EXROOT = remote.getGlobal('EXROOT')
window.APPDATA_PATH = remote.getGlobal('APPDATA_PATH')
window.POI_VERSION = remote.getGlobal('POI_VERSION')
window.SERVER_HOSTNAME = remote.getGlobal('SERVER_HOSTNAME')
window.MODULE_PATH = remote.getGlobal('MODULE_PATH')

require('module').globalPaths.push(window.MODULE_PATH)
// Add ROOT to `require` search path
require('module').globalPaths.push(window.ROOT)
