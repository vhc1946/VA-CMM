const path = require('path');
const fs = require('fs');
var {NEDBconnect}=require('../../repo/tools/box/nedb-connector.js');
var DataStore = require('nedb');

var apppaths = require('../../../app/paths.json');
var {auser} = require('../appuser.js');
var appstorepath = path.join(apppaths.deproot,apppaths.store.root);
var appstore = apppaths.store;

/*  Store Request
    PASS:
    - request:{
        store:"",
        method:"",
        pack:""
    }
*/
var StoreRequest=(request)=>{
  return new Promise((res,rej)=>{
    if(request.store&&appstore[request.store]){
      storeconnect = new NEDBconnect(
        {filename:path.join(auser.cuser.spdrive,apppaths.deproot,appstore.root,appstore[request.store].file)},
        appstore[request.store].ensure
      );
      switch(request.method){
        case "query":{
          storeconnect.QUERYdb(request.pack.query).then(
            result=>{return res(result);}
          );break;
        }
        case "update":{
          storeconnect.UPDATEdb(request.pack.query,request.pack.update,request.pack.options).then(
            result=>{return res(result);}
          );break;
        }
        case "insert":{
          storeconnect.INSERTdb(request.pack.docs).then(
            result=>{return res(result);}
          );break;
        }
        case "remove":{
          storeconnect.REMOVEdoc(request.pack.query,request.pack.multi).then(
            result=>{return res(result);}
          );break;
        }
        default:{return res(false);}
      }
    }
  });
}


module.exports={
  StoreRequest
}
