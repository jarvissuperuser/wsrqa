const Setup = require("../setup");
const UJC = require('../userjourney');
const Logger = require('../multiLogger');

let uj = undefined;
let log = new Logger();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const mobileAgent = '';
let project = '';
let isMobile = '';
let runTests = '';
let new_path = '';
let special_tag = '';
let stp = new Setup();


const options = {
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

let startUp = async ()=>{

    if (!uj.page) {

    }
    return uj.page;
};

let finish = () => {

};
let image_log = async () =>{
    /*let qry = "insert into log_info(t_id,log_info,log_image) values ("
        + ujt.project_id + ",\"Site:" +projects[project]
        +" Unit:"+method
        +"\",\""+ creds[2].concat(".png")+"\")";
    ujt.logToDataBase(qry);*/
    return await log.log("Site:" + uj.name
        +" Unit:" + uj.timestamp ,uj.fileName,'log_info',1);

};

function delay(sec){
    return new Promise((w)=>{
        setTimeout(()=>{w('done')},(sec?sec*1000:4000));
    });
}

async function runTestNative(m,b_path,new_path){
    let files = [];
    switch (m) {
        case "empty":
            // uj.fileName = b_path + uj.name + ".png";
            files.push(uj.fileName);
            image_log();
            await uj.getScreens();
            break;
        case "login":
            if (stp.get_values(special_tag,m)) {
                uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
                uj.name = b_path + uj.name;
                await uj.login_(new_path);
                //let re = await uj.page.waitForNavigation({waitUntil: "load"});
                //console.log(re);
                await delay(7);
                let l_pic =  uj.name + "_login_complete.png";
                let e_pic = uj.name + "_login_email.png";
                files.push(e_pic);
                files.push(l_pic);
                await uj.page.screenshot({path: l_pic});
                const msgLog = m + " @ " + uj.timestamp;
                let insert = await log.log(msgLog,l_pic,"log_info",1);
                console.log("Logged @",insert);
            }
            console.log("close ", new_path);
            break;
        case "reset":
            uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
            uj.name = b_path + uj.name;
            //await uj.(new_path);
            break;
        case "buy":
             let buy_promise = new Promise((win) => {
                uj.fileName = b_path + uj.name + "_paywall.png";
                console.log(uj.fileName);
                uj.testLocations = new_path;
                files.push(uj.fileName);
                win();
            });
            buy_promise.then(() => {
                return new Promise(uj.getScreensP);
            }).catch(err => console.log(err));
            break;
        case "free_article":

        default:
            console.log("No Thing");
    }
    return files;
}

module.exports = async(p, m, t) => {
    project = p;
    isMobile = m;
    runTests = t;
    stp.init("../app.ini");
    let b_path = "./public/images/";
    uj = new UJC();
    uj.log = true;
    uj.project = '';
    uj.filesExist = {pivot:false,test:false};
    uj.testImg = '';
    uj.pivotImg = '';
    uj.name = (projects[project] === undefined) ? project : projects[project];
    console.log("Loading Tests app at " , uj.timestamp);
    try {
        special_tag = p.substring(0, 2);
        b_path = stp.get_values(special_tag,"path");
        new_path = stp.get_url(special_tag, m==="no"?'empty':m);
        uj.fileName = b_path + uj.name + ".png";
        //uj.testLocations = b_path;
        console.log('web_Path',new_path);
    }catch (e) {
        console.error(e.message);
     }

    try {
        //setup
        await uj.initBrowser();
        await uj.md(b_path);
        uj.testLocations = new_path;
        let orName =  b_path + uj.name;
        uj.pivotImg = b_path + uj.name + ".png";
        uj.diff_img = b_path + uj.name + uj.timestamp + "diff.png";
        uj.fileName = b_path + uj.name + uj.timestamp + ".png";
        uj.testImg = uj.fileName + ".png";
        if (t === 'no')
            await runTestNative(m,b_path,new_path);
        else if (t === "yes"){
            await new Promise(uj.checkFilesP);
            let files = await runTestNative(m,b_path,new_path);
            uj.filesExist["test"] = true;
            uj.testImg = files[0];
            console.log(files,"generated");
            for (var a = 0; a < files.length;a++)
                await uj.runDiff(files[a]);
        }
        console.log("done");
        uj.closeBrowser();
    }catch (e) {
        console.log(e, "from" ,uj.name , uj.testLocations);
    }
};
