const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
// const textFind = require("./textFind");
// const moment =  require("moment");
// const dev =  require("./devDescExt");

let pm = new PM();
let wPath = ['type'],hlAuths = ['cfed06c57f46c97f35a19b28d14ce5d76642ad7e','218c927a86087b0d88271f08b65f522fa202a4ce',
    'c1755c19dae31608a309b8e02feb1255a951d92e','13cf29b4412f34332bcd6eb189cdcfc21d0b6c94',
    'e21390f1356077b881f03d91a7dd319e85124fd4','e9fe0250314f601257d35e1252b614b0173a5f0b',
    'b2be95c6330a7f70819edd93b2ff6dd54d65f941','c77ce2fa3c2bf20420e65c4aa80e1e9d57a02847'
    ,'c45635b1c1b11dc3cb54a1ec36da09c48867d392','510f3bf5e11de6eb9f02797f452c557fdd74cf79'];
let u = new UJMan();
const p = 'bl';
// const pub = 'sowetan-live';
let config = new CFG();
config.init("./app.ini");
// config.get_url(p)
config.env = "live";


let getAuthtradeToken = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"])=>{
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

let getSubs = async (pub,email,token)=>{
    await pm.sendRequest(config.get_url(p)+"/apiv1/subscriptions/get-tx?access_token="+token,function (r) {
        console.log(r.resp);
    },{
        method: "POST",
        json :{
            email : email
        }
    });
};

let getUserSubs = async (pub,email,token)=>{
    let userAccountId = "";
    await pm.sendRequest(config.get_url(p)+"/apiv1/user/me?access_token="+token,function (r) {
        console.log(r.resp.ext);
        userAccountId = r.resp.ext.paradise.user_ids;
    },{
        method: "POST",
        json :{
            email : email
        }
    });
    return userAccountId;
};


let getUser = async (pub,email,token)=>{
    await pm.sendRequest(config.get_url(p)+"/apiv1/user/subscriptions?access_token="+token,function (r) {
        console.log(r.resp);
    },{
        method: "POST",
        json :{
            email : email
        }
    });
};

let getTestParadise = async (pub,userId,token)=>{
    await pm.sendRequest(config.get_url(p)+"/apiv1/test/paradise-user-subs?access_token=",function (r) {
        console.log(r.resp);
    },{
        method: "POST",
        json :{
            user_id : userId
        }
    });
};


(async function main() {
    let creds = ["blank","mark.antoncich@absa.africa","CorpDev2019"];
    // let creds = ["blank","mugadzatt01@gmail.com",'Ttm331371'];
    let token = await getAuthToken(p,creds);
    await getSubs(p,creds[1],token);
    let uId = await getUserSubs(p,creds[1],token);
    await getUser(p,creds[1],token);
    await getTestParadise(p,uId[0],token);
    console.log(uId);
})();
