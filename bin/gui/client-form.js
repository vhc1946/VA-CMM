
//account includes
  //customer
  //address
//site includes

var CREATEprojectforms=(curragree)=>{   // Sets up layout using ViewControl
    let block = NEWvcsetup();
    block.id = 'build-info-edit';
    vcontrol.SETUPviews(block,'mt');

    cont = document.createElement('div');
    cont.id = 'CLIENT';
    vcontrol.ADDview('CLIENT',cont,block,false);
    cont.appendChild(CREATEinputform(curragree.customer,'client'));

    let projectinclude = ["name","street","unit","city","state","zip"];  // Fields to include for Project tab

    cont = document.createElement('div');
    cont.id = 'PROJECT';
    vcontrol.ADDview('PROJECT',cont,block,false);
    cont.appendChild(CREATEinputform(curragree,'project',projectinclude,true));

    return block;
}


var NEWvcsetup=()=>{
    let vcblock = document.createElement('div');  // Creates new ViewControl setup!
    vcblock.classList.add('viewcontrol-cont');
    vcblock.appendChild(document.createElement('div'));
    vcblock.lastChild.classList.add('viewcontrol-menu');
    vcblock.lastChild.appendChild(document.createElement('div'));
    vcblock.appendChild(document.createElement('div'));
    vcblock.lastChild.classList.add('viewcontrol-port');

    return vcblock;
}

var CREATEinputform=(data,type,compare=[],include=false)=>{   // Generic function to create input form based on data's structure
    let ins = document.createElement('div');
    ins.classList.add(`${type}-info-cont`)
    for(let eg in data){
        if(include){
            if(compare.includes(eg)){CREATEinputfield(ins,eg,type);}
        }else{
            if(!compare.includes(eg)){CREATEinputfield(ins,eg,type);}
        }
    }
    return ins;
}

var CREATEinputfield=(cont,eg,type)=>{
    cont.appendChild(document.createElement('label'));
    cont.lastChild.innerText = toTitleCase(eg);
    cont.appendChild(document.createElement('input'));
    cont.lastChild.classList.add(`${type}-${eg}`);
}


var CREATEjobform=(curragree)=>{
    let ins = document.createElement('div');
    ins.classList.add('project-info-cont');

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "Project Name";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-name`);

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "Street";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-street`);

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "Unit";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-unit`);

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "City";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-city`);

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "State";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-state`);

    ins.appendChild(document.createElement('label'));
    ins.lastChild.innerText = "Zip";
    ins.appendChild(document.createElement('input'));
    ins.lastChild.classList.add(`project-zip`);

    return ins;
}

function toTitleCase(str) {
    var lcStr = str.toLowerCase();
    return lcStr.replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
    });
}

module.exports={
    CREATEprojectforms
}
