var webshot = require("webshot");
var moment = require("moment");
var resemble = require("node-resemble-js");
var fs = require('fs-extra');
var dbl = require('../sqlite_con_man');
var amqp = require('amqp-connection-manager');
var async = require("async");
var UJC = require('../userjourney');

var uj = new UJC();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const modbileAgent = '';
var dbi = new dbl("../app.db");
let project = '';
let isMobile = '';
let runTests = '';
let QueueName = '';
var connection = amqp.connect(['amqp://admin:root1234@localhost:5672']); //guest only when client is local on server host

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

var testurls = {
    "tl_home": "www.timeslive.co.za",
    "tl_article": "www.timeslive.co.za/politics/2018-01-18-ramaphosa-piles-pressure-on-zuma-with-anti-corruption-call",
    "bl_home": "www.businesslive.co.za",
    "sl_home": "www.sowetanlive.co.za",
    "w_home": "wantedonline.co.za"
};
var projects = {
    "tl_home": "timeslive",
    "tl_article": "timeslive",
    "bl_home": "businesslive",
    "sl_home": "sowetanlive",
    "w_home": "wanted"
};

var testLocations;

module.exports = async(p, m, t) => {

    project = p;
    isMobile = m;
    runTests = t;
    uj.timestamp = moment().format("MM-D-YY-h-mm-s");
    uj.log = true;
    uj.project = '';
    uj.filesExist = {pivot:false,test:false};
    uj.testImg = '';
    uj.pivotImg = '';
    var b_path = "./public/images/";
    uj.setup(b_path,projects,project);
    console.log("Loading Tests app at " , uj.timestamp);
    uj.name = (projects[p] === undefined) ? project : projects[p];
    try{
        uj.dbi = new dbl("../app.db");
        uj.dbSetup();
    }
    catch(ex){
        uj.dbi.multiquery(["insert into test(t_name) values('" + name + "')"]);
        uj.dbi.e.on('done', () => {
            //console.log(db.datamulti[0, 0].length);
            var d = uj.dbi.datamulti[0];
            stopper = false;
            uj.dbi.db.all("select id from test order by id desc limit 1", (err, rows) => {
                rows.forEach((row) => {
                    uj.project_id = row.id;
                });
            });
        });
    }

    var pr = new Promise(function(w,f){
        uj.testLocations = testurls[project];
        uj.setup(b_path,projects,p);
        uj.checkFilesP(w,f);
    });
    pr.then(() => {
        return new Promise(function(w,f){
            uj.filesInit(b_path);
            uj.getScreensP(w,f);
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
};
