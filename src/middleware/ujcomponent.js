const moment = require("moment");
const async = require("async");
const UJC = require('../userjourney');
const puppet = require("puppeteer");
const devices = require("../devDescExt");

let ujt = undefined;
let project = '';
let method = '';
let runTests = '';
let QueueName = '';

let appenditure = {
	login:"/u/sign-in/",
	register:"/u/sign-up/",
	reset:"/u/reset/"
};

const testurls = {
	"tl_home": "www.timeslive.co.za",
	"bl_home": "www.businesslive.co.za",
	"sl_home": "www.sowetanlive.co.za",
	"w_home": "www.wantedonline.co.za",
    "hl_home": "www.heraldlive.co.za",
    "ts_home": "select.timeslive.co.za"
};
const projects = {
	"tl_home": "timeslive",
	"ts_home": "timesselect",
	"bl_home": "businesslive",
	"sl_home": "sowetanlive",
	"w_home": "wanted",
    "hl_home":"herald"
};

let testLocations = "";

let p_input = async (page,selector,info)=>{
    await page.click(selector);
    await page.keyboard.type(info);
}

let findSpace = (data) =>{
    while(data.search(" ")>0)
        data=data.replace(" ","+");
    return data;
}

let auth = (data)=>{
    let cleaner= findSpace(data);//cleaner string
    let info = Buffer.from(cleaner,'base64').toString();
    return info.split('<:>');
}
let browser = undefined;
let page  = undefined;
let creds = [];
let b_path = "./public/images/";

let image_log = () =>{
    let qry = "insert into log_info(t_id,log_info,log_image) values ("
        + ujt.project_id + ",\"Site:" +projects[project]
        +" Unit:"+method
        +"\",\""+ creds[2].concat(".png")+"\")";
    ujt.logToDataBase(qry);
}

let iFrameClick = async (target) => {
    let frame = await page.frames().find(f=>{
         if (f._url.search("google.com/recaptcha/api2/bframe?")>0)
            return f
    });
    console.log(frame.$(target));
    //const elem = await frame.document.querySelector(target);
    //await elem.click();
}

let waitInSec = async(sec)=>{
    await new Promise(function (resolve,reject) {
        if (isNaN(sec)) reject("time value not number");
        setTimeout(function () {
            console.log("complete:",sec,'s');
            resolve();
        },parseFloat(sec)*1000);
    });
}


let login_do = async ()=>{
    await page.goto(testLocations);
    creds = auth(runTests);
    ujt.name = creds[2];
    ujt.dbSetup();

    if (creds.length > 1) {
        await p_input(page, "input[type=email]", creds[0]);
        await p_input(page, "input[type=password]", creds[1]);
    }
    await page.click("button[type=button]");
    await waitInSec(4.5);
    console.log('input');
    if(creds[2]) {
        image_log();
        await page.screenshot({path: b_path.concat(creds[2].concat(".png"))});
    }else {
        console.log('images not created',creds);
    }
};

let reset_do = async ()=>{
    await page.goto(testLocations);
    creds = auth(runTests);
    ujt.name = creds[2];
    ujt.dbSetup();

    if (creds.length >= 1) {
        await p_input(page, "input[type=email]", creds[0]);
    }
    await page.click("button[type=button]");
    await waitInSec(2.5);
    console.log('input');
    if(creds[2]) {
        image_log();
        await page.screenshot({path: b_path.concat(creds[2].concat(".png"))});
    }else {
        console.log('images not created',creds);
    }
};

let register_do = async ()=>{
    await page.goto(testLocations);
    creds = auth(runTests);
    ujt.name = creds[2];
    ujt.dbSetup();

    await iFrameClick("span.recapture-box");
    if (creds.length >= 1) {
        await p_input(page, "input[type=email]", creds[0]);
    }
    await page.click("button[type=button]");
    await waitInSec(2.5);
    console.log('input');
    if(creds[2]) {
        image_log();
        await page.screenshot({path: b_path.concat(creds[2].concat(".png"))});
    }else {
        console.log('images not created',creds);
    }
};


let base_test = async (name)=>{
    await page.goto(testLocations);
    creds = auth(runTests);
    await waitInSec(2.5);
    console.log('input');
    await page.screenshot({path:b_path.concat(name.concat(".png"))});
};

module.exports = async(p, m, t) => {
	project = p;
	runTests = t;
	method = m;
	let url_suffix = appenditure[m?m:"login"];
	ujt = new UJC();
	ujt.project ="";
	testLocations = "http://".concat(testurls[p],url_suffix);
	console.log(testLocations,p,m,t);

	try {
	    browser = await puppet.launch();
	    page = await browser.newPage();
        await page.emulate(devices['1366x768']);
	    switch (m){
            case 'login':
                console.log('launch');
                await login_do();
                break;
            case 'reset':
                await reset_do();
                break;
            case 'register':
                await register_do();
                break;
            default:
                base_test(method.concat("_",timestamp));
        }
        browser.close();
    }catch (exc) {
	    browser.close();
		console.log(exc);
    }
};
