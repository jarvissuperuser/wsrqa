const UJMan = require("./userjourney");
const CFG = require("./setup");
const PM = require("./post_mn");
// const jd = require("diff");

let u = new UJMan();
let config = new CFG();
let pm = new PM();
const p = 'bl';
let success = false;
let foundOffer = true;
let build = null;
let pageOffer = [];
config.init("./app.ini");



let wordingTest = async (input = [], offerBody = "")=> {
    let score = {};
    score.win = 0;
    score.failed = [];
    const wording = input.hasOwnProperty("length")?input:input.split('\n');
    if (wording.hasOwnProperty('length')){
        wording.forEach(async (phrase,index)=>{
            score.win = offerBody.contains(phrase)?score.win+1:score.win;
            if(!offerBody.contains(phrase))score.failed.push(index);
        });
        score.result = wording / score.win;
    }
    return score;
};


let getAuthToken = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"])=>{
    let files = {};
    await pm.sendRequest(config.get_url(p)+'/apiv1/auth/consumer/get-all',function (resp) {
        let data = resp.json();
        //console.log(data[0].consumer_secret);
        files['secret'] = data[0].key;
    });
    await pm.sendRequest(config.get_url(p)+`/apiv1/auth/issue-request-token?consumer_key=${files.secret}&agent=tim`,function (res) {
        //console.log(res.resp,res.statusCode,config.get_url(p));
        files['request_token'] = res.json().token;
        files['request_secret'] = res.json().secret;
    }).catch((e)=>{console.error(e)});
    await pm.sendRequest(`${config.get_url(p)}/apiv1/auth/issue-access-token?`+
        `request_token=${files.request_token}`,function (res) {
            console.log(res.json().token,res.statusCode,config.get_url(p));
            files['access_token'] = res.json().token;
            files['access_secret'] = res.json().secret;
        },
        {
            method:"POST",
            form:{
                username:cred[1],
                password:cred[2]
            }
        }
    ).catch((e)=>{console.error(e)});
    return files.access_token;
};


(async function main() {
    await u.initBrowser('1366x768');
    const auth = await getAuthToken(p);
    await u.page.goto(config.get_url(p,'buy') + `?access_token=${auth}`);
    //await u.page.screenshot({path:"./payWall.png"});
    const btns = await u.page.$$('.subscribe');

    const text = await u.page.evaluate( () => Array.from( document.querySelectorAll( 'body' ),
        element => element.innerText))
        .catch(e=>console.log(e.message));
    console.log(text[0]);
    await u.page.waitFor(1000);
    if (typeof await btns === "object"){}
    await u.browser.close();
})();