const $ = require('jquery');
var {ipcRenderer,BrowserWindow}=require('electron');
var {app,ipcMain,viewtools} = require('../bin/repo/tools/box/electronviewtool.js');
var {usersls,agreementsls}=require('../bin/gui/storage/lstore.js');
var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {DropNote}=require('../bin/repo/gui/js/modules/vg-poppers.js');
var {navroutes,dashroutes,bidroutes}=require('../bin/routes.js');

var {ObjList}=require('../bin/repo/tools/box/vg-lists.js');
var distools = require('../bin/repo/gui/js/tools/vg-displaytools.js');

var vcontrol = require('../bin/repo/gui/js/layouts/view-controller.js');
var gentable = require('../bin/repo/gui/js/modules/vg-tables.js');

var curruser = JSON.parse(localStorage.getItem(usersls.curruser));
var ubids = new ObjList();
console.log(curruser);
//  TITLE BAR //////////////////////////////////
try{
  document.getElementById(Titlebar.tbdom.info.username).innerText = JSON.parse(localStorage.getItem(usersls.curruser)).uname;
}catch{}
document.getElementById(Titlebar.tbdom.title).innerText = 'Commercial Maintainance Manager - Dashboard';

let mactions={
}
let qactions={
  refresh:{
    id:'refresh-dash',
    src:'../bin/repo/assets/icons/refresh-icon.png',
    title:'Refresh Dash'
  }
}

let malist=Titlebar.CREATEactionbuttons(mactions);
let qalist=Titlebar.CREATEactionbuttons(qactions);

Titlebar.ADDmactions(malist);
Titlebar.ADDqactions(qalist);

document.getElementById(Titlebar.tbdom.page.user).addEventListener('click',(ele)=>{//GOTO LOGIN
  ipcRenderer.send(navroutes.gotologin,'Opening Login Dash...');
});


//can fill startingdata (or another variable) with aquote() properties.
//
document.getElementById('bid-action-new').addEventListener('dblclick',(ele)=>{
  var startingdata={};
  ipcRenderer.send(bidroutes.create,startingdata);
});
var loadthebid=false;
document.getElementById('bid-action-resume').addEventListener('dblclick',(ele)=>{
  var lastbid = localStorage.getItem(agreementsls.lastagreement);
  if(lastbid){
    loadthebid=true;
    ipcRenderer.send(dashroutes.getbid,lastbid);
  }else{DropNote('tr','NO BID TO LOAD');}
});
document.getElementById(qactions.refresh.id).addEventListener('dblclick',(ele)=>{
  ipcRenderer.send(dashroutes.getuserbids,curruser.uname);
});
////////////////////////////////////////////////////////////////


var btdom={
  actions:{
    new:'bid-action-new',
    resume:'bid-action-resume'
  },
  tables:{
    cont:'bid-tables-container',
    row:'bid-table-row'
  }
}

//  BID TABLE /////////////////////////////////////////////////////////
var bidtabletabs={
  O:'Open',
  S:'Sold'
}
var bidtableheads={
  O:{
    id:'ID',
    name:'JOB NAME',
    estimator:'CONSULTANT',
    street:'ADDRESS',
    customer:{
      name:'CUSTOMER'
    },
    opendate:'OPEN DATE'
  },
  S:{
    id:'ID',
    name:'JOB NAME',
    estimator:'CONSULTANT',
    street:'ADDRESS',
    customer:{
      name:'CUSTOMER'
    },
    opendate:'SUBMIT Date'
  }
}

var bidtablemaps={
  O:(r=null)=>{
    if(!r||r==undefined){console.log(r);r={}}
    return{
      id:r.id||'',
      name:r.name||'',
      estimator:r.estimator||'',
      street:r.street||'',
      customer:r.customer!=undefined? r.customer.name||'':'',
      opendate:r.opendate||'',
    }
  },
  S:(r=null)=>{
    if(!r||r==undefined){console.log(r);r={}}
    return{
      id:r.id||'',
      name:r.name||'',
      estimator:r.estimator||'',
      street:r.street||'',
      customer:r.customer!=undefined? r.customer.name||'':'',
      subdate:r.subdate||'',
    }
  }
}

/* Set/Reset the Bid Tables */
var SETquotetable=()=>{
  let tcont = document.getElementById(btdom.tables.cont);
  vcontrol.CLEARview(tcont);

  for(let s in bidtablemaps){
    var v = document.createElement('div');
    let l = [].concat(bidtableheads[s],ubids.TRIMlist({status:s}));
    v = vcontrol.ADDview(bidtabletabs[s],v,tcont);
    SETgridview(ubids.TRIMlist({status:s}),v);
  }
  tcont.getElementsByClassName(vcontrol.vcdom.menu.cont)[0].children[0].children[0].click(); //sets nav to first tab

}

vcontrol.SETUPviews(document.getElementById(btdom.tables.cont),'mtl');

var SETgridview=(list,view)=>{   // Creates a Grid-style display list
  view.appendChild(document.createElement('div'));
  view.lastChild.classList.add('grid-table-cont');
  for(let i=0;i<list.length;i++){
    cell = view.lastChild.appendChild(document.createElement('div'));
    cell.classList.add('grid-table-cell');
    cell.appendChild(document.createElement('div'));
    cell.lastChild.innerText = 'Business Name' //list[i].customer.name;
    cell.appendChild(document.createElement('img'));
    cell.lastChild.src = '../bin/repo/assets/logos/V-Mark Red.png';
    cell.lastChild.classList.add('gt-comp-logo');
    cell.appendChild(document.createElement('div'));
    cell.lastChild.innerText = 'Job Name'; //list[i].name;
    cell.appendChild(document.createElement('div'));
    cell.lastChild.innerText = list[i].id;  //Job ID
    cell.lastChild.title = 'id';
    cell.appendChild(document.createElement('div'));
    cell.lastChild.innerText = 'Job Site Address'; //list[i].street;  
    cell.appendChild(document.createElement('div'));
    cell.lastChild.innerText = `Customer's Rep`; //list[i].customer.rep;
  }
}

document.getElementById(btdom.tables.cont).addEventListener('dblclick',(ele)=>{
  var row = distools.FINDparentele(ele.target,'grid-table-cell');
  if(row){
    loadthebid=true;
    ipcRenderer.send(dashroutes.getbid,gentable.GETrowTOobject(row).id);
  }
});






// ACTION BUTTONS //////////////////////////////////////////////////////////////
//can fill startingdata (or another variable) with aquote() properties.
//
document.getElementById('bid-action-new').addEventListener('click',(ele)=>{
  var startingdata={};
  ipcRenderer.send(bidroutes.create,startingdata);
});
var bidtoresume=false;
document.getElementById('bid-action-resume').addEventListener('click',(ele)=>{
  var lastbid = localStorage.getItem(agreementsls.lastagreement);
  if(lastbid){
    bidtoresume=true;
    ipcRenderer.send(dashroutes.getbid,lastbid);
  }else{DropNote('tr','NO BID TO LOAD');}
});

////////////////////////////////////////////////////////////////////////////////


ipcRenderer.send(dashroutes.getuserbids,curruser.uname);

ipcRenderer.on(dashroutes.getuserbids,(eve,data)=>{
  console.log('USER BIDS> ',data);
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
    ubids.SETlist(data.body);
    SETquotetable();
  }else{
    DropNote('tr',data.msg,'yellow');
  }
});
ipcRenderer.on(dashroutes.loadbid,(eve,data)=>{
  console.log('LOAD BID> ',data);
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
  }else{
    DropNote('tr',data.msg,'yellow');
  }
});
ipcRenderer.on(dashroutes.getbid,(eve,data)=>{
  console.log('GET BID>',data);
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
    localStorage.setItem(agreementsls.agreementtoload,JSON.stringify(data.body));
    if(loadthebid){ipcRenderer.send(dashroutes.loadbid,'RESUME');}
  }else{
    DropNote('tr',data.msg,'yellow');
  }
  bidtoresume=false;
});
ipcRenderer.on(bidroutes.create,(eve,data)=>{
  console.log('CREATE> ',data);
  if(data.success){
    //save data.body to localStorage
    DropNote('tr',data.msg,'green');
    localStorage.setItem(agreementsls.agreementtoload,JSON.stringify(data.body));
    ipcRenderer.send(dashroutes.getuserbids,curruser.uname);
    ipcRenderer.send(dashroutes.loadbid,'NEW AGREEMENT');
  }else{DropNote('tr',data.msg,'red');}
});
ipcRenderer.on(bidroutes.openfolder,(eve,data)=>{
  console.log(data);
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
    console.log(data);
  }else{
    DropNote('tr',data.msg,'yellow');
  }
});
