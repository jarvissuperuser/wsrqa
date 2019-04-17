// const UJMan = require("./userjourney"); //not in use
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");
const dev =  require("./devDescExt");

let pm = new PM();
let wPath = ['type'],hlAuths = ['cfed06c57f46c97f35a19b28d14ce5d76642ad7e','218c927a86087b0d88271f08b65f522fa202a4ce',
    'c1755c19dae31608a309b8e02feb1255a951d92e','13cf29b4412f34332bcd6eb189cdcfc21d0b6c94',
    'e21390f1356077b881f03d91a7dd319e85124fd4','e9fe0250314f601257d35e1252b614b0173a5f0b',
    'b2be95c6330a7f70819edd93b2ff6dd54d65f941','c77ce2fa3c2bf20420e65c4aa80e1e9d57a02847'
    ,'c45635b1c1b11dc3cb54a1ec36da09c48867d392','510f3bf5e11de6eb9f02797f452c557fdd74cf79'];
// let u = new UJMan();
const p = 'bl';
const pub = 'sowetan-live';
let config = new CFG();
config.init("./app.ini");
// config.get_url(p)
config.env = "live";

let getAuthtradeToken = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"])=>{
    let files = {};
    await pm.sendRequest(config.get_url(p)+'/apiv1/auth/consumer/get-all',function (resp) {
        // console.log(resp, "auth");
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
            // console.log(res.json().token,res.statusCode,config.get_url(p));
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

let getUser = async (pub,email,token)=>{
    let response  = {};
    await pm.sendRequest(config.get_url(p)+"/apiv1/user/subscriptions?access_token="+token,function (r) {
        response = (r.resp);
    },{
        method: "POST",
        json :{
            email : email
        }
    });
    return response;
};

let getSubs = async (pub,email,token)=>{
    let response = {};
    await pm.sendRequest(config.get_url(p)+"/apiv1/subscriptions/get-tx?access_token="+token,function (r) {
        response = r.resp;
    },{
        method: "POST",
        json :{
            email : email
        }
    });
    return response;
};

let getTestParadise = async (pub,userId,token)=>{
    let response = {};
    await pm.sendRequest(config.get_url(p)+"/apiv1/test/paradise-user-subs?access_token="+token,function (r) {
        response = (r.resp);
    },{
        method: "POST",
        json :{
            user_id : userId
        }
    });
    return response;
};

let Subs = async function (data) {
    // console.log(data);
    const { path, email, password, actions, pub } = data;
    const  cred = ["",email,password];
    const token = await getAuthtradeToken(pub,cred);
    switch (actions) {
        case "get-subs":
            return await getSubs(pub,email,token);
        case "get-reg":
            return await getUser(pub,email,token);
        case "get":
    }
    return {none:null};
};

module.exports = Subs;
