/* App User Settings
    This file controls the communication to localy stored user settings on user's
    computer. The file could be further to access ALL (not just users) local
    storage of application settings/data.
    In addition, the files sets and holds the aappuser object used throughout the
    programs operation.
*/

var fs = require('fs');
var {aappuser} = require('../repo/ds/users/vogel-users.js');

let locpath = 'C:/IMDB/';
let usetfile = 'userset.json';

var auser = null;
if(!fs.existsSync(locpath)){fs.mkdirSync(locpath)};//create IMDB local folder if it doesnt exist
try{auser = require(locpath + usetfile);}
catch{auser = aappuser();}

//  User Functions //
var SETUPappuser=(users,uname=null,pswrd=null)=>{
  if(users[uname]!=undefined){
    auser.uname = uname;
    auser.pswrd = pswrd;
    auser.config = users[auser.uname];

    fs.writeFileSync(locpath+usetfile,JSON.stringify(auser))
    return true;
  }else{return false}
}

var RESETappuser=()=>{
  auser.uname = '',
  auser.pswrd = '',
  auser.config = {};
  fs.writeFileSync(locpath+usetfile,JSON.stringify(auser));
}

module.exports={
  auser,
  SETUPappuser,
  RESETappuser
}
