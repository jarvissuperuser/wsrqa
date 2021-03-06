let exec = require("child_process").exec;
let Stp = require("./setup");

let setup = new Stp();

setup.init("../app.ini");
let urlList = [];
let target = ["tl_home","wo_home","sl_home","bl_home","dl_home","bl_home","st_home"];
function pop_blank(test) {
    test=test?test:'no';
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=empty&t=${test}`);
    });
}
function pop_login(test) {
    test=test?test:'no';
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=login&t=${test}`);
    });
}

function pop_paywall(test) {
    test=test?test:'no';
    target.forEach((el)=>{
        urlList.push(`http://localhost:3000/regressiontest/?p=${el}&m=buy&t=${test}`);
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
    //pop_login();
    //await url_iterate(19);
    urlList = [];
   	pop_blank("no");
    await url_iterate(26);
    // urlList =[];
    // pop_paywall();
    // await url_iterate(16);
}

test_endpo();
