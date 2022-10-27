var gentools = require("../repo/tools/box/vg-gentools.js")

var CREATEprojectforms=(curragree)=>{   // Sets up layout using ViewControl
    let block = document.createElement('div');
    block.id = 'build-info-edit';
    vcontrol.CREATEviewport(block,'mt');
    
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
    cont.lastChild.classList.add(`${type}-label-${eg}`);
    cont.lastChild.innerText = gentools.toTitleCase(eg);
    cont.appendChild(document.createElement('input'));
    cont.lastChild.classList.add(`${type}-input-${eg}`);
}




module.exports={
    CREATEprojectforms
}