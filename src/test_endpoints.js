let exec = require("child_process").exec;
let Stp = require("./setup");

let setup = new Stp();

setup.init("../app.ini");
let urlList = [];
let target = ["tl_home","wo_home","sl_home","bl_home","dl_home","bl_home","st_home"];
function pop_blank() {
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=empty&t=yes`);
    });
}
function pop_login() {
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=login&t=no`);
    });
}

function pop_paywall() {
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=buy&t=no`);
    });
}

function delay(sec){
    return new Promise((w)=>{
        setTimeout(()=>{w('done')},(sec?sec*1000:4000));
    });
}

function t_curl(url) {
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

async function url_iterate(time){
    //pop_login();
    for (let a = 0; a<urlList.length;a++){
        await t_curl(urlList[a]);
        await delay(time);
    }
}



async function test_endpo() {
    pop_blank();
    await url_iterate(13);
    // urlList = [];
    // pop_login();
    // await url_iterate(16);
    // urlList =[];
    // pop_paywall();
    // await url_iterate(16);
}

test_endpo();