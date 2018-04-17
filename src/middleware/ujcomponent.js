var webshot = require("webshot");
var moment = require("moment");
var resemble = require("node-resemble-js");
var fs = require('fs-extra');
var dbl = require('../sqlite_con_man');
var async = require("async");
var UJC = require('../userjourney');
var puppet = require("puppeteer");

var uj = new UJC();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const modbileAgent = '';
var dbi = new dbl("../app.db");
let project = '';
let isMobile = '';
let runTests = '';
let QueueName = '';

var options = {
	screenSize: {
		width: 1920,
		height: 1080
	},
	shotSize: {
		width: "all",
		height: "all"
	},
	userAgent: desktopAgent
};

let appenditure = {
	login:"/u/sign-in/",
	register:"u/sign-up/",
	reset:"/u/reset/"
};

let testurls = {
	"tl_home": "www.timeslive.co.za",
	"bl_home": "www.businesslive.co.za",
	"sl_home": "www.sowetanlive.co.za",
	"w_home": "wantedonline.co.za"
};
let projects = {
	"tl_home": "timeslive",
	"tl_article": "timeslive",
	"bl_home": "businesslive",
	"sl_home": "sowetanlive",
	"w_home": "wanted"
};

let testLocations = "";

let p_input = async (page,selector,info)=>{
    await page.click(selector);
    await page.keyboard.type(info);
}

let auth = (data)=>{

    var info = Buffer.from(data,'base64').toString();
    return info.split('<:>');
}
let browser = undefined;
module.exports = async(p, m, t) => {

    let b_path = "./public/images/";
	project = p;
	testLocations = "http://".concat(testurls[p],appenditure[m]);
	runTests = t;
	console.log(testLocations,p,m,t);
	try {
	    browser = await puppet.launch();
        const page = await browser.newPage();
        console.log('launch');
        await page.goto(testLocations);
        var creds = auth(runTests);
        await p_input(page,"input[type=email]",creds[0]);
        await p_input(page,"input[type=password]",creds[1]);
        await page.click("button[type=button]");
        await new Promise(function (resolve,reject) {
            setTimeout(function () {
                console.log("timeout:3s");
                resolve();
            },5000);
        });
        console.log('input');
        await page.screenshot({path:b_path.concat("puppettest1.png")});

        browser.close();
    }catch (exc) {
	    browser.close();
		console.log(exc);
    }
};
