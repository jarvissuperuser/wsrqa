var Setup = require("../setup");
var moment = require("moment");
var resemble = require("node-resemble-js");
var fs = require('fs-extra');
var dbl = require('../sqlite_con_man');
var amqp = require('amqp-connection-manager');
var async = require("async");
var UJC = require('../userjourney');

let uj = undefined;
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const modbileAgent = '';
let dbi = new dbl("../app.db");
let project = '';
let isMobile = '';
let runTests = '';
let new_path = '';
let special_tag = '';
let stp = new Setup();


var options = {
    screenSize: {
        width: 1366,
        height: 768
    },
    shotSize: {
        width: "all",
        height: "all"
    },
    userAgent: desktopAgent
};

const testurls = {
    "tl_home": "www.timeslive.co.za",
    "tl_article": "www.timeslive.co.za/politics/2018-01-18-ramaphosa-piles-pressure-on-zuma-with-anti-corruption-call",
    "bl_home": "www.businesslive.co.za",
    "sl_home": "www.sowetanlive.co.za",
    "wo_home": "www.wantedonline.co.za"
};
let projects = {
    "tl_home": "timeslive",
    "tl_article": "timeslive",
    "bl_home": "businesslive",
    "sl_home": "sowetanlive",
    "wo_home": "wanted"
};
const appenditures = {
    articles:{},
    pages:{},
    categories:{},
    sub_articles:{}
};

let testLocations;



module.exports = async(p, m, t) => {
    project = p;
    isMobile = m;
    runTests = t;

    let b_path = "./public/images/";
    uj = new UJC();
    uj.log = true;
    uj.project = '';
    uj.filesExist = {pivot:false,test:false};
    uj.testImg = '';
    uj.pivotImg = '';
    uj.name = (projects[project] === undefined) ? project : projects[project];
    stp.init("../app.ini");
    console.log("Loading Tests app at " , uj.timestamp);
    try {
        special_tag = p.substring(0, 2);
        new_path = stp.get_url(special_tag, m);
        console.log('Path',new_path);
    }catch (e) {
        console.error(e.message);
     }

    try {
        switch (m) {
            case "empty":
                let new_promise = new Promise((win) => {
                    uj.fileName = b_path + uj.name + ".png";
                    console.log(uj.fileName);
                    uj.testLocations = new_path;
                    win();
                });
                new_promise.then(() => {
                    return new Promise(uj.getScreensP);
                }).catch(err => console.log(err));
                break;
            case "login":
                uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
                uj.name = b_path + uj.name;
                await uj.initBrowser();
                await uj.login_(new_path);
                await uj.closeBrowser();
                break;
            case "reset":
                uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
                uj.name = b_path + uj.name;
                await uj.initBrowser();
                //await uj.(new_path);
                await uj.closeBrowser();
                break;
            default:
                console.log("No Thing");
        }
    }catch (e) {
        console.log(e);
    }

};
