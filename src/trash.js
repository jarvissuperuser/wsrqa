/***
 * Middleware.js
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
    "w_home": "wantedonline.co.za"
};
let projects = {
    "tl_home": "timeslive",
    "tl_article": "timeslive",
    "bl_home": "businesslive",
    "sl_home": "sowetanlive",
    "w_home": "wanted"
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

    var b_path = "./public/images/";
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
    //console.log(uj);

    if (false){//haha
        try{

            uj.dbi = new dbl("../app.db");
            uj.dbSetup();
        }
        catch(ex){
            console.log("dbi exception",ex);
            dbi = new dbl("../app.db");
            dbi.multiquery(["insert into test(t_name) values('" + uj.name + "')"]);
            dbi.e.on('done', () => {
                //console.log(db.datamulti[0, 0].length);
                //var d = dbi.datamulti[0];
                stopper = false;
                dbi.db.all("select id from test order by id desc limit 1", (err, rows) => {
                    rows.forEach((row) => {
                        uj.project_id = row.id;
                    });
                });
            });
        }
        if (uj.timestamp) {
            console.log(uj.timestamp);
            var pr = new Promise(function (w, f) {
                uj.testLocations = testurls[project];
                uj.setup(b_path, projects, p);
                uj.filesInit(b_path);
                uj.checkFilesP(w, f);
            });
            pr.then(() => {
                return new Promise(function (w, f) {
                    uj.filesInit(b_path);
                    uj.getScreensP(w, f);
                });
            }).then((gsp) => {
                return new Promise(uj.checkFilesP);
            }).then((f) => {
                if (uj.filesExist.test)
                    uj.runDiff(uj.name, uj.timestamp);
                else
                    console.log("nothing to test':'diff avoided");
            }).catch((ex) => {
                console.error(ex, "app error");
            });
        }
    } else {
        if (m)
        {
            let new_promise = new Promise((win)=>{
                uj.fileName = b_path + uj.name + ".png";
                console.log(uj.fileName);
                uj.testLocations  = new_path;
                win();
            });
            new_promise.then(()=>{
                return new Promise(uj.getScreensP);
            }).catch(err=>console.log(err));
        }
    }
};

 ///** sqlite_con_man

 var init = require("sqlite3").verbose();
 var ev = require('events').EventEmitter;
 var e = new ev();
 var db = null;
 var qry = "";
 var datamulti = [];
 var counter = 0;
 var list = [];
 // its going to be terminal app for now

 var argv = "";

 var manager = function(path_name) {
    db = new init.Database(path_name);
    this.db = db;
    this.fires = 0;
    this.fails = 0;
    this.e = e;
    e.on('res_done', this.listenercb);
};

 manager.prototype.data = {};
 manager.prototype.datamulti = [];
 manager.prototype.list = [];
 manager.prototype.qry = "";
 manager.prototype.listenercb = function(data) {
    datamulti.push(data.detail);
    if (list)
        if (datamulti.length === list.length) {
            manager.prototype.datamulti = datamulti;
            datamulti = [];
            e.emit('done');
        }
};
 manager.prototype.listenercdn = null;
 /**
 @param [] lst

manager.prototype.multiquery = function(lst) {
    var p = null;
    var selff = this;
    list = lst;
    lst.forEach((qy) => {
        qry = qy;
        this.transaction(qry)
    });
};

manager.prototype.transaction = function(qry) {
    db.all(qry, (err, row) => {
        e.emit("res_done", { detail: err ? err : row });
    });
};


module.exports = manager;

*/
/*
*
* //
		// await mouse.move(parseFloat(x), parseFloat(y));
		// await mouse.click(parseFloat(x), parseFloat(y), {
		// 	"button": "left",
		// 	"clickCount": 1,
		// 	"delay": 0
		// });
		//const btn = await u.page.evaluate(()=>{document.querySelector(".subscribe")});
		//await console.log();
		// //await btn[i].click().catch((e)=>{console.log(e)});
		// await u.page.$eval("body",boby => {
		// 	try {
		// 		// console.log(btn);
		// 		boby.querySelectorAll(".subscribe")[i].click();
		//
		// 	}catch (e) {
		// 		console.log(e)
		// 	}
		// 	//throw Error(boby.querySelectorAll(".subscribe")[i]);
		// }).catch((e)=>console.log(e));
* */