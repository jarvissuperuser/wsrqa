let exec = require("child_process").exec;
let Stp = require("./setup");

let setup = new Stp();

setup.init("../app.ini");
let urlList = [];
let target = ["tl_home","wo_home","sl_home","bl_home","dl_home","bl_home"];
function pop() {
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=empty&t=yes`);
    });
}

function delay(){
    return new Promise((w)=>{
        setTimeout(()=>{w('done')},4000);
    });
}

function curl(url) {
    return new Promise((w)=>{
        let uri = `curl "${url}"`;
        exec(uri,(a,b,c)=>{
            if (a){
                console.log(a);
                w(a)
            }
            console.log(uri);
            w(b)
        });
    });
}

async function spawn(){
    pop();
    for (let a = 0; a<urlList.length;a++){
        await curl(urlList[a]);
        await delay();
    }
}

spawn();