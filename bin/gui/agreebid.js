const $=require('jquery');
var {ipcRenderer}=require('electron');
var RROOT='../bin/repo/';
var Titlebar=require('../bin/repo/gui/js/modules/vg-titlebar.js');

var {bidroutes}=require('../bin/routes.js');
var {agreementsls}=require('../bin/gui/storage/lstore.js');
//layouts
var {stdbook}=require('../bin/repo/gui/js/layouts/vg-stdbook.js');
var vcontrol=require('../bin/repo/gui/js/layouts/view-controller.js');

var gentable=require('../bin/repo/gui/js/modules/vg-tables.js')
var domtools=require('../bin/repo/gui/js/tools/vg-displaytools.js');

//tools
var {ObjList}=require('../bin/repo/tools/box/vg-lists.js');
var {DropNote}=require('../bin/repo/gui/js/modules/vg-poppers.js');
var {CREATEticket} = require('../bin/repo/logger/things/support-form.js');
var {CREATEprojectforms} = require('../bin/gui/client-form.js');

var curragree = null;
console.log(agreementsls.agreementtoload);
try{
  curragree = JSON.parse(localStorage.getItem(agreementsls.agreementtoload));
  console.log(curragree);
  if(curragree){
    localStorage.setItem(agreementsls.lastagreement,curragree.id);
    DropNote('tr','AGREEMENT LOADED','green');
  }else{DropNote('tr','NO AGREEMENT TO LOAD','yellow');}
}catch{
  DropNote('tr','ERROR LOADING AGREEMENT');
}
localStorage.setItem(agreementsls.agreementtoload,null);

window.addEventListener('beforeunload',(eve)=>{
  localStorage.setItem(agreementsls.agreementtoload,JSON.stringify(curragree));
});
// SETUP STDBOOK ///////////////////////////////////////////////////////////////
var blddom={ //build dom
  cont:'vg-stdbook-pages',
  nav:{
    sidebar: "vg-stdbook-cont-sidenav",
    sidebuttons: "vg-stdbook-cont-sidenav-button",
    sidebuttonsele: "vg-stdbook-cont-sidenav-button-selected",
    right: "vg-stdbook-cont-sidenav-right",
    left: "vg-stdbook-cont-sidenav-left",
    viewbuttons:{
      info:'cmm-info-button',
      systems:'cmm-servitems-button',
      accessories:'cmm-bid-button',
      summary:'cmm-summary-button'
    }
  },
  pages:{
    cont:'vg-stdbook-pages',
    views:{
      info:'cmm-build-info',
      systems:'cmm-build-servitems',
      accessories:'cmm-build-bid',
      summary:'cmm-build-summary'
    }
  }
}

var agrbook = new stdbook(blddom.pages.views,blddom.nav); //build module layout

////////////////////////////////////////////////////////////////////////////////

// SETUP TITLEBAR //////////////////////////////////////////////////////////////
document.getElementById(Titlebar.tbdom.title).innerText = curragree.id + ' ' +  curragree.customer.name + ' - Bid Setup';

let mactions={
  delete:{
    id:'delete-quote',
    src:'../bin/repo/assets/icons/trash.png',
    title:'Delete Quote'
  },
  support:{
    id:'support-ticket',
    src:'../bin/repo/assets/icons/info.png',
    title:'Support'
  }
}
let qactions={
  save:{
    id:'save-quote',
    src:'../bin/repo/assets/icons/disk.png',
    title:'Save Quote'
  }
}

let malist=Titlebar.CREATEactionbuttons(mactions);
let qalist=Titlebar.CREATEactionbuttons(qactions);

Titlebar.ADDmactions(malist);
Titlebar.ADDqactions(qalist);

document.getElementById(qactions.save.id).addEventListener('dblclick',(ele)=>{
  if(chcksavebid){
    ipcRenderer.send(bidroutes.save,{});
    chcksavebid=false;
  }else{DropNote('tr','...Currently Saving','yellow');}
});
document.getElementById(mactions.delete.id).addEventListener('dblclick',(ele)=>{
  if(chckdeletebid){
    ipcRenderer.send(bidroutes.delete,curragree.id);
    chckdeletebid=false;
  }else{DropNote('tr','...Currently Saving','yellow');}
});
document.getElementById(mactions.support.id).addEventListener('dblclick',(ele)=>{
  CREATEticket();
});
////////////////////////////////////////////////////////////////////////////////


// CLIENT FORM SETUP ///////////////////////////////////////////////////////////
document.getElementById('cmm-build-info').appendChild(CREATEprojectforms(curragree));



var chckdeletebid = true;
var chcksavebid = true;

// BID MODULES /////////////////////////////////////////////////////////////////
var bidinfo = require('../bin/gui/bidder/cmm-buildinfo.js');

////////////////////////////////////////////////////////////////////////////////
/* Saving Summary
    TOGGLEsummary - called to show and hide the summary so the back-end can
    print-screen the window. The function will show or hide dependant on the
    status of lastv.

    lastv - holds FALSE or the variable name (found in blddom.pages.views)
    associated with the name of the last open view before the function toggled
*/
let lastv = false;
var TOGGLEsummary=()=>{
  if(blddom.nav.viewbuttons[lastv]){
    document.getElementsByClassName(blddom.nav.left)[0].getElementsByClassName(blddom.nav.viewbuttons[lastv])[0].click();
    lastv = false;
  }else{
    lastv = qbook.GETcurrentview();
    document.getElementsByClassName(blddom.nav.right)[0].getElementsByClassName(blddom.nav.viewbuttons.summary)[0].click();
  }
}

ipcRenderer.on(bidroutes.save,(eve,data)=>{
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
    console.log(data.data)
  }else{
    DropNote('tr',data.msg,'yellow');
  }
  chcksavebid = true;
});
ipcRenderer.on(bidroutes.delete,(eve,data)=>{
  if(data&&data.success){
    DropNote('tr',data.msg,'green');
    localStorage.setItem(agreementsls.lastagreement,null);
    setTimeout(()=>{window.close()},50);
  }else{
    DropNote('tr',data.msg,'yellow');
  }
  chckdeletebid = true;
});
