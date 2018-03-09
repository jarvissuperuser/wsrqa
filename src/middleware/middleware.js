var webshot = require("webshot");
var moment = require("moment");
var resemble = require("node-resemble-js");
var fs = require('fs-extra');
var dbl = require('../sqlite_con_man');
var amqp = require('amqp-connection-manager');
var async = require("async");

const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const modbileAgent = '';
var dbi = new dbl("../app.db");
let project = '';
let isMobile = '';
let runTests = '';
let testImg = '';
let pivotImg = '';
let fileName = '';
let QueueName = '';
var filesExist;
var project_id;
var channelWrapper;
var timestamp;
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
    "bl_live": "businesslive",
    "sl_home": "sowetanlive",
    "w_home": "wanted"
};

var testLocations;

const runDiff = (name, timestamp) => {

    try {
        if (filesExist.pivot && filesExist.test)
            resemble(pivotImg)
            .compareTo(testImg).ignoreNothing().onComplete(function(data) {
                if (data.misMatchPercentage > 5) {
                    console.log("name:" + name + ",datafailed:true", './public/images/' + project + '/' + name + '_' + timestamp + '_diff.png');
                    data.getDiffImage().pack().pipe(fs.createWriteStream('./public/images/' + project + '/' + name + '_' + timestamp + '_diff.png'));
                } else {
                    console.log("name:" + name + ",datafailed:false");
                }

            });
        else
            throw ("runDiff error");
    } catch (ex) {
        console.log(ex, "no file found");
    }
};

var checkFilesP = (resolve, reject) => {
    let parentDir = getParentDir(fileName);
    fs.readdir(parentDir, (err, files) => {
        if (!err) {
            console.log("listing files");
            files.forEach(file => {
                if (file === extractFile(pivotImg)) {
                    filesExist["pivot"] = true;
                }
                if (file === extractFile(testImg)) {
                    filesExist["test"] = true;
                }
            });
            console.log(filesExist, extractFile(filesExist.test ? testImg : pivotImg),
                "list file .done");
            resolve();
        } else {
            fs.emptyDir('./public/images/' + project + '/', err => {
                if (err) {
                    console.log("files error", err);
                    reject(process.exit('0'));
                }
                console.log("Creating Project here", err);
                resolve();
            });
        }
    });
}

var getScreensP = (resolve, reject) => {
    fileName = (filesExist.pivot) ?
        './public/images/' + project + '/' + name + '_' + timestamp + '.png' : './public/images/' + project + '/' + name + '.png';

    try {
        console.log(fileName, "attempt for image");
        webshot(testLocations, fileName, options, function(err) {
            console.log("img error or rundiff");
            if (err) {
                console.log(err);
                reject(err);
            }
            //else if (filesExist.pivot&&filesExist.test)
            //runDiff(name,timestamp);
            console.log("Building test cases", QueueName);
            resolve()
                //res.write("yes:"+err.message);
                //}
        });
    } catch (ex) {
        console.log("exception getscreen", ex);
    }
}

var arrayToPath = (arr) => {
    return arr.join('/');
}
var getParentDir = (path) => {
    try {
        var splitPath = path.split('/');
        splitPath.pop();
        return arrayToPath(splitPath);
    } catch (ex) {
        console.log(ex);
    }

};
var extractFile = (filePath) => {
    var arr = filePath.split("/"); //unix/unix-like
    arr.reverse();
    return arr[0];
};

var logToDataBase = (qry) => {
    if (project_id !== 0)
        dbi.db.all(qry, function(err, row) {
            console.log(this.lastID);
        });
}

module.exports = async(p, m, t) => {

    project = p;
    isMobile = m;
    runTests = t;

    timestamp = moment().format("MM-D-YY-h-mm-s");
    console.log("Loading Tests app at " + timestamp);
    name = (projects[p] === undefined) ? project : projects[p];
    testImg = './public/images/' + project + '/' + name + '_' + timestamp + '.png';
    pivotImg = './public/images/' + project + '/' + name + '.png';
    fileName = (runTests === 'yes') ? testImg : pivotImg;
    filesExist = { test: false, pivot: false };
    QueueName = name + "_" + timestamp;
    var stopper = true;
    dbi.multiquery(["insert into test(t_name) values('" + QueueName + "')"]);
    dbi.e.on('done', () => {
        //console.log(db.datamulti[0, 0].length);
        var d = dbi.datamulti[0];
        stopper = false;
        dbi.db.all("select id from test order by id desc limit 1", (err, rows) => {
            rows.forEach((row) => {
                project_id = row.id;
            });
        });
    });
    //preconfig = paths
    //checkFiles();
    testLocations = testurls[project];
    var pr = new Promise(checkFilesP);
    pr.then(() => {
        return new Promise(getScreensP);
    }).then((gsp) => {
        return new Promise(checkFilesP);
    }).then((f) => {
        if (filesExist.test)
            runDiff(name, timestamp);
        else
            console.log("nothing to test':'diff avoided");
    }).catch((ex) => {
        console.error(ex, "app error");
    });
};