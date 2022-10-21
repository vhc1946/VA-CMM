/*  Routes
    File holds all the route names for communication
    between ipcMain and ipcRenderer.

    routes can be add and organized as needed with
    in the module.expoerts = {}
*/
var winroutes = {
  minimize:'view-minimize'
}
var navroutes = {
  gotologin:'goto-login',
  gotodash:'goto-dash'
}

var bidroutes = {
  create:'createbid',
  save:'savebid',
  close:'closebid',
  sell:'sellbid',
  delete:'deletebid',
  openfolder:'openbidfolder'
}

var dashroutes = {
  getuserbids:'getuserbids',
  loadbid:'loadbid',
  getbid:'getbid'
}

module.exports = {
  winroutes,
  navroutes,
  bidroutes,
  dashroutes
}
