const  path = require('path'),
       fs = require('fs'),
       os = require('os'),
       request = require('request'),
       {shell}=require('electron');

var au = require('./bin/back/appuser.js'); //initialize the app user object
// Electron Tools/vars /////////////////////////////////////////////////////////
var {app,ipcMain,BrowserWindow,viewtools} = require('./bin/repo/tools/box/electronviewtool.js');

var mainv; //holds the main BrowserWindow
var bidvs=[]; //holds all open bids {id:'',views:BrowserWindow}
var defw = 1080;  //Default window width
var defh = 750;   //Default window height
////////////////////////////////////////////////////////////////////////////////

// Routes //////////////////////////////////////////////////////////////////////
var {loginroutes}=require('./bin/repo/gui/js/modules/login.js');
var {winroutes,navroutes,bidroutes,dashroutes}=require('./bin/routes.js');
////////////////////////////////////////////////////////////////////////////////

// File/Folder paths ///////////////////////////////////////////////////////////
var apppaths = require('./app/paths.json');
var approot = path.join(au.auser.cuser.spdrive,apppaths.deproot);
var appsettpath = path.join(approot,apppaths.settings);
var appset = require(appsettpath);//appset.dev.on = true;
var controlsroot = path.join(__dirname,'/controllers/'); //dir path to views
var storeroot = path.join(__dirname,'/store/'); //dir path to db store
var binroot = path.join(__dirname,'/bin/'); //dir path to bin


var {StoreRequest} = require('./bin/back/store/storemanager.js');
////////////////////////////////////////////////////////////////////////////////

var conout = false; //internet connection
require('dns').resolve('www.google.com',(err)=>{if(!err){conout=true;}}); //check for internet connection
////////////////////////////////////////////////////////////////////////////////

/* LANDING PAGE
    The landing page will more often be the login screen
    This login screen can be skipped by editing the
    appset.dev.on = true. This will default to main.html
    If the developer wants to skip to a page, the
    appset.dev.page = '' can have a desired page file
    name
*/
app.on('ready',(eve)=>{
  if(!appset.dev.on){
    console.log(au.auser);
    if(appset.users[au.auser.uname]==undefined){
      mainv = viewtools.loader(controlsroot + 'login.html',defw,defh,false,false,'hidden');
    }else{
      try{//attempt to open users default page
        mainv = viewtools.loader(controlsroot + appset.groups[au.auser.config.group].main,defw,defh,false,false,'hidden');
      }catch{mainv = viewtools.loader(controlsroot + 'login.html',defw,defh,false,false,'hidden');}
    }
    mainv.on('close',(eve)=>{ //any app closing code below
      app.exit();
    });
  }else{appset.dev.page==''?mainv = viewtools.loader(controlsroot+'main.html',defw,defh,false,false,false):mainv=viewtools.loader(controlsroot+appset.dev.page,defw,defh,false,false,'hidden')}
});

/* APP login
    data:{
      user:'',
      pswrd:''
    }

    Recieve a user name and password from login form AND
    attach the application auth code to it. The api is
    queried to check both the auth code and the user
    credentials.

    If the access/login to the api is a success, the
    appset.users is checked for a match to the user name.

    If the user is found in appset.users, that users group
    view (appset.groups.main) 'dash' is loaded
*/
ipcMain.on(loginroutes.submit,(eve,data)=>{
  if(au.SETUPappuser(appset.users,data.uname,data.pswrd)){ //check to see if username matches app settings
    viewtools.swapper(mainv,controlsroot + appset.groups[au.auser.config.group].main,defw,defh);
  }else{eve.sender.send(loginroutes.submit,{status:false,msg:'Not an app user',user:null})}
});

// Titlebar Request
ipcMain.on(winroutes.minimize,(eve,data)=>{BrowserWindow.getFocusedWindow().minimize();});

// Request login screen
ipcMain.on(navroutes.gotologin,(eve,data)=>{
  au.RESETappuser();
  console.log('login')
  viewtools.swapper(mainv,controlsroot + 'login.html',defw,defh);
});

// SUPPORT/LOGGING /////////////////////////////////////////////////////////////
var {SupportLog} = require('./bin/repo/logger/store/store-support.js');
var appsupport = new SupportLog(approot);

ipcMain.on('open-support-ticket', (eve,data)=>{
  if(data.id!=undefined){
    data.id=appset.name + '-' + new Date().getTime();
    data.dept = appset.dept;
    data.user=au.auser.uname;
    data.phone=au.auser.config.phone;
    data.email=au.auser.config.email;
    appsupport.INSERTdb(data).then(
      (stat)=>{
        if(stat){eve.sender.send('open-support-ticket',{msg:"Support Ticket Submitted",status:true});}
        else{eve.sender.send('open-support-ticket',{msg:"Support Ticket NOT Submitted",status:false});}
      }
    );
  }
});
////////////////////////////////////////////////////////////////////////////////


// DASHROUTES //////////////////////////////////////////////////////////////////

// getuserbids
ipcMain.on(dashroutes.getuserbids,(eve,data)=>{
  var rpak={
    success:false,
    msg:'BAD USERNAME',
    body:{}
  }
  if(data&&data!=undefined){
    StoreRequest({
      store:'oagreements',
      method:'query',
      pack:{query:{estimator:data}}
    }).then(
      result=>{
        rpak.body=result;
        if(!result.err){
          if(result.docs.length>0){
            rpak.success=true;
            rpak.msg='FOUND AGREEMENTS';
            rpak.body=result.docs;
          }else{rpak.msg='NO USER AGREEMENTS FOUND'}
        }else{rpak.msg='COULD NOT SEARCH AGREEMENTS'}
        eve.sender.send(dashroutes.getuserbids,rpak);
      }
    )
  }else{eve.sender.send(dashroutes.getuserbids,rpak);}
});
// loadbid
ipcMain.on(dashroutes.loadbid,(eve,data)=>{
  bidvs.push({id:'',view:viewtools.loader(controlsroot + 'agreement-bidder.html',defw,defh,false,false,'hidden')});
  eve.sender.send(dashroutes.loadbid,{success:true,msg:'WORKING',body:{}});
});
// getbid
/* Get a bid
   PASS:
   - data = (the bid id)
*/
ipcMain.on(dashroutes.getbid,(eve,data)=>{
  var rpak={
    success:false,
    msg:'BAD SEARCH ID',
    body:{}
  }
  if(data&&data!=undefined){
    StoreRequest({
      store:'oagreements',
      method:'query',
      pack:{query:{id:data}}
    }).then(
      result=>{
        rpak.body=result;
        if(!result.err){
          if(result.docs.length==1){
            rpak.success=true;
            rpak.body=result.docs[0];
            rpak.msg='FOUND AGREEMENT'
          }else{rpak.msg='COULD NOT FIND AGREEMENT';}
        }else{
          rpak.msg='ERROR FINDING AGREEMENT';
        }
        eve.sender.send(dashroutes.getbid,rpak);
      }
    );
  }else{eve.sender.send(dashroutes.getbid,rpak);}
});
////////////////////////////////////////////////////////////////////////////////

var {aquote}=require('./bin/repo/ds/quotes/vogel-quote.js');
// BIDROUTES ///////////////////////////////////////////////////////////////////
//create new bid
ipcMain.on(bidroutes.create,(eve,data)=>{
  var newbid = aquote();
  newbid.id = 'CMM-'+new Date().getTime();
  newbid.estimator = au.auser.uname;
  if(data&&data!=undefined){
    for(let d in data){
      if(newbid[d]!=undefined){newbid[d]=data[d]}
    }
  }

  var rpak={
    success:false,
    msg:'ATTEMPTED TO CREATE',
    body:{}
  }
  StoreRequest({
    store:'oagreements',
    method:'insert',
    pack:{docs:newbid}
  }).then(
    result=>{
      rpak.body=result;
      if(!result.err){
        rpak.body=newbid;
        rpak.success=true;
      }else{
        rpak.msg="WAS NOT CREATED"
      }
      eve.sender.send(bidroutes.create,rpak);
    }
  )
});
// savebid
ipcMain.on(bidroutes.save,(eve,data)=>{
  eve.sender.send(bidroutes.save,{success:false,msg:'NOT STARTED',body:{}});
});
// closebid
ipcMain.on(bidroutes.close,(eve,data)=>{
  eve.sender.send(bidroutes.close,{success:false,msg:'NOT STARTED',body:{}});
});
// sellbid
ipcMain.on(bidroutes.sell,(eve,data)=>{
  eve.sender.send(bidroutes.sell,{success:false,msg:'NOT STARTED',body:{}});
});
// deletebid
ipcMain.on(bidroutes.delete,(eve,data)=>{
  var rpak={
    success:false,
    msg:'BAD SEARCH ID',
    body:{}
  }
  if(data&&data!=undefined){
    StoreRequest({
      store:'oagreements',
      method:'remove',
      pack:{query:{id:data}}
    }).then(
      result=>{
        rpak.body=result;
        if(!result.err){
          if(result.num==1){
            rpak.success=true;
            rpak.body=data;
            rpak.msg='AGREEMENT '+data+' WAS DELTED'
          }else{rpak.msg='COULD NOT DELETE AGREEMENT';}
        }else{
          rpak.msg='ERROR DELETING AGREEMENT';
        }
        eve.sender.send(bidroutes.delete,rpak);
      }
    )
  }else{eve.sender.send(bidroutes.delete,rpak);}
});

// open bid folder
ipcMain.on(bidroutes.openfolder,(eve,data)=>{
  eve.sender.send(bidroutes.openfolder,{success:false,msg:'NOT STARTED',body:{}});
});

////////////////////////////////////////////////////////////////////////////////
