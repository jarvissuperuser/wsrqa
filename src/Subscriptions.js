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

let getFromPath=(obj ={},path =[])=>{
    let result = obj;
    path.forEach(e=>{
        if (result&&result.hasOwnProperty(e))
            result = result[e];
    });
    return result;
};

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

let getUser = async (pub,email,token,path ="")=>{
    let response  = {};
    let final_response = [];
    await pm.sendRequest(config.get_url(p)+"/apiv1/user/subscriptions?access_token="+token,function (r) {
        response = (r.resp);
    },{
        method: "POST",
        json :{
            email : email
        }
    });
    if (Array.isArray(response) && path.length>2){

        response.forEach(e=>{
            final_response.push(getFromPath(e,path.split(",")));
        });
    }
    return final_response.length>0?final_response:response;
};

let getSubs = async (pub,email,token,path = "")=>{
    let response = {};
    let final_response = [];
    await pm.sendRequest(config.get_url(p)+"/apiv1/subscriptions/me?access_token="+token,function (r) {
        response = r.resp;
    },{
        method: "POST",
        json :{
            email : email
        }
    });

    if (Array.isArray(response) && path.length>2){
        response.forEach(e=>{
            final_response.push(getFromPath(e,path.split(",")));
        });
    }else{
        if( path.length>2){
            final_response.push(getFromPath(response,path.split(",")))
        }
    }

    return final_response.length>0?final_response:response;
};

let search = (widgetName,widgets = [])=>{
    return widgets.some((w)=>{return w===widgetName});
};

const articleWidgetList = (w,id, article,widgetsList = [],pub="bl")=>{
    let widgetValue = getFromPath(w,wPath);
    let result = [];
    if (search(widgetValue,widgetsList)){
        result = (
            `<div class="w3-container w3-border-gray"><a href='${ config.get_url(pub) }${ article["pub_url"] }' `+
            `class="w3-red w3-button w3-bar-item">${ article.title}</a><div class="w3-bar-item">`+
            "</div><div class='w3-bar-item'>Position:" +id+"</div><div class='w3-bar-item'>WidgetType:"+ w.type+"</div><div class='w3-bar-item'>" +article["widgets"].length+"</div></div>");
        // console.log("\t",widgetValue, id,">>");
    }
    return result;
};

const articleWidgetSearch = (article,widgetsList =[],pub="tl")=>{

    let result = "";
    if (article["widgets"]){
        article["widgets"].some((w,id)=>{
            let val = (articleWidgetList(w,id,article,widgetsList,pub));
            if(val.length>0){
                result = val;
                return true;
            }
        });
    }
    return result;
};


/**
 * @Doc
 * The get-widget case is unmaintainable
 * */
let Subs = async function (data) {
    // console.log(data);
    const { path, email, password, actions, pub } = data;
    const  cred = ["",email,password];
    const token = await getAuthtradeToken(pub,cred);
    switch (actions) {
        case "get-subs":
            return await getSubs(pub,email,token,path);
        case "get-reg":
            return await getUser(pub,email,token,path);
        case "get-widget":
            let result = [];
            let widgetsList = email.split(',');
            await pm.sendRequest(config.get_url(pub) + "/apiv1/workflow/get-all",
                function (r) {
                    if (Array.isArray(r.resp)){
                        r.resp.forEach(( { article } )=>{
                            let val  = articleWidgetSearch(article,widgetsList,pub);
                            if (val.length>0)
                                result.push(val);
                        });
                    }else {
                        console.log(r.resp,">> error");
                    }
                },{
                    method : "POST",
                    json:
                        {
                            status: "featured",
                            limit: 50,
                            offset: 0,
                            publication: config.get_values(pub,"publication"),
                            section: config.get_values(pub,"sections")[path?path:0]
                        }
                });
            return result;
        case "get-search-widget":
            let res= [];
            let wList = path.split(",");
            await pm.sendRequest( config.get_url(pub)+'/apiv1/pub/articles/get-all?access_token=d2b5fcdb34d9739637444befb469e05e2d49e271',
                function (r) {
                    // console.log(Array.isArray(r.resp), "r.resp");
                    if (Array.isArray(r.resp)){
                        // console.log("Response is array",r.resp.length);
                        r.resp.forEach((article)=>{
                            // if (Array.isArray(article.widgets)){
                                let val = articleWidgetSearch(article,wList,pub);
                                if(val.length>0){
                                    res.push(val);
                                }
                            // }
                        });
                    } else {
                        console.log(r.resp,r,'>>Error 2');
                    }
                },{
                    method : "POST",
                    json:
                        {
                            status: "published,draft",
                            query: email,
                            limit: 100,
                            offset: 0,
                            access_token: "d2b5fcdb34d9739637444befb469e05e2d49e271",
                            stripped: true
                        },

                });
            return res;
    }
    return {none:null};
};

module.exports = Subs;
