const UJMan = require("./userjourney");
const CFG = require("./setup");
const PM = require("./post_mn");
const fs = require("fs-extra");
const textFind = require("./textFind");
// const jd = require("diff");

let u = new UJMan();
let config = new CFG();
let pm = new PM();
const p = 'dl';
let success = false;
let foundOffer = true;
let build = null;
let pageOffer = [];
config.init("./app.ini");

let readFile = (filename)=>{
    return fs.readFileSync(filename).toString();
};

let wordingTest = (input = [], offerBody = "")=> {
    let score = {};
    score.win = 0;
    score.failed = [];
    let wording = Array.isArray(input)?input:input.split('\n');
    wording = wording.filter(w=>w!=="");
    score.wording = wording;
    console.log(Array.isArray(wording));
    console.log(wording.length);
    console.log(wording);

    if (wording.hasOwnProperty('length')){
        wording.forEach((phrase,index)=>{
            score.win = (textFind(offerBody,phrase,'l')&&phrase)?score.win+1:score.win;
            (textFind(offerBody,phrase,'l'))?console.log("found",phrase):console.log("not found",phrase);
            if(!(textFind(offerBody,phrase,'l')) && phrase)score.failed.push(index);
        });
        score.result = score.win /wording.length ;
    }
    score.count = {len:wording.length};
    return score;
};

let scoring = (score) =>{
    if (score.failed){
        score.failed.forEach(f=>{
            console.log("fail", score.wording[f]);
        });
    }
    console.log("Phrases:", score.count.len,  " > found:",score.win ,` >> results: ${score.result * 100}%`);
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
    const textA = readFile("CleanedWordingTest.expect.test");
    const score = await wordingTest(textA,text[0]);
    scoring(score);
    await u.page.waitFor(1000);
    if (typeof await btns === "object"){}
    await u.browser.close();
})();