const fs = require("fs-extra");
const resemble = require("node-resemble-js");
const mmnt = require("moment");
const puppet = require("puppeteer");
const devices = require("./devDescExt");
const QB = require("./querybuilder");
let qb = new QB();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';

const opts = {
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
let selfer = null;

let waitInSec = (sec)=>{
    new Promise(function (resolve,reject) {
        if (isNaN(sec)) reject("time value not number");
        setTimeout(function () {
            console.log("complete:",sec,'s');
            resolve(true);
        },parseFloat(sec)*1000);
    });
};

class UserJourney{
    
    constructor(options){
        this.options = options?options:opts;
        this.project = '';
        this.isMobile = '';
        this.runTests = '';
        this.testImg = '';
        this.pivotImg = '';
        this.diff_img = '';
        this.fileName = '';
        this.QueueName = '';
        this.filesExist = { test: false, pivot: false };
        this.project_id = 0;
        this.timestamp = mmnt().format("MM-D-YY-h-mm-s");
        this.testLocations = "http://timeslive.co.za";
        this.name = '';
        this.base_url ="./public/images/";
        selfer = this;
        this.log = false;
        this.dbi = qb.db;
        this.browser = null;
        this.page = null;
        this.cred = null;
        this.email = "input[type='email']";
        this.password = "input[type='password']";
    }
    setup(base_path,projects,p){
        console.log("ujsetup");
        let self = selfer;
        self.base_url = base_path?base_path:'./public/images/';
        self.project = p;
        self.name = (projects === undefined) ? self.project : projects[p];
    }
    async initBrowser(dev){
        this.browser = await puppet.launch({headless: true, args:['--no-sandbox']});
        this.page = await this.browser.newPage();
        let device = dev?devices[dev]:devices['1366x768'];
        await this.page.emulate(device);
    }
    async closeBrowser(){
        if (this.browser)
            await this.browser.close();
    }
    dbSetup(){
        console.log("uj DB setup");
        return new Promise((w,f)=> {
            try {
                let self = selfer;
                self.dbi = qb.db;
                let qry = qb.insert("test", ["tname"], ['?']);
                self.dbi.db.run(qry, [self.name] ,function (err, rows) {
                    self.project_id = this.lastID;
                    win(self)
                })
            } catch (e) {
                f([e,selfer]);
            }
        });
    }
    filesInit(imgBsPath){
        console.log("files init");
        let self = selfer;
        console.log("timestamp",self.timestamp);
        self.testImg = self.testImg?self.testImg:imgBsPath + self.project + '/' + self.name + '_' + self.timestamp + '.png';
        self.pivotImg = self.pivotImg?self.pivotImg:imgBsPath + self.project + '/' + self.name + '.png';
        self.fileName = (self.filesExist.pivot) ? self.testImg : self.pivotImg;
        self.QueueName = self.name + "_" + self.timestamp;
        self.fileName = (self.filesExist.pivot) ?self.testImg
            :self.pivotImg;
        self.diff_img = imgBsPath + self.project + '/' + self.name + '_' + self.timestamp + '_diff.png';
    }
    genMessage(opt,mismatch){
        let msg;
        let self = selfer;
        let insert = "insert into log_info(t_id,log_info,log_image) values(";
        let update = "";
        let pID = (self.project_id===undefined?0:self.project_id);
        let q= "";
        let fileFound = self.filesExist.test ? self.testImg : self.pivotImg;
        switch(opt){
            case "readdir":
                msg = "Test Found "+ (self.filesExist.test?"Test Img":"Pivot Img");
                q =insert+ pID+",\""+ msg+"\",\""
                    +self.extractFile(fileFound)+"\")";
                break ;
            case "emptydir":
                msg = "Project created here"
                q =insert+ pID+",\""+ msg+"\",\""
                    +self.extractFile(fileFound)+"\")";
                break ;
            case "mismatchY":
                msg = "Image Difference :" + mismatch +"\%. "+this.extractFile(self.pivotImg);
                q=insert+ pID+",\""+ msg+"\",\""
                    +self.extractFile(self.diff_img)+"\")";
                break ;
            case "mismatchN":
                msg = "Image Difference :" + mismatch +"\%.";
                q=insert+ pID+",\""+ msg+"\",\""
                    +self.extractFile(fileFound)+"\")";
                break ;

            case "update":
                msg = "";
                q=update+ pID+",\""+ msg+"\",\""
                    +self.extractFile(fileFound)+"\")";
                break ;
            default:
                break ;
        }
        if (self.log)
            this.logToDataBase(q);
    }
    async login_(url){
        if(this.cred && this.page){
            await this.page.goto(url,{waitUntil:"domcontentloaded"});
            await this.input_(this.email,this.cred[1]);
            await this.page.click("button[type]");
            await this.page.screenshot({path:`${this.name}_${this.timestamp}_login_email.png`});
            await this.input_(this.password,this.cred[2]);
            await this.page.click("button[type]");
        }
    }
    async input_(selector,data){
        await this.page.click(selector);
        await this.page.keyboard.type(data);
    }
    checkFilesP(resolve, reject) {
        console.log("files checker");
        let self = selfer;
        let parentDir = self.getParentDir(self.pivotImg);
        fs.readdir(parentDir, (err, files) => {
            if (!err) {
                console.log("listing files >>" ,self.pivotImg, self.testImg);
                let s = self;
                files.forEach(file => {
                    if (file === self.extractFile(self.pivotImg))
                        self.filesExist["pivot"] = true;
                    if (file === self.extractFile(self.testImg)) 
                        self.filesExist["test"] = true;
                    if (!self.log)
                        console.log(file);
                });
                let fileFound = self.filesExist.test ? self.testImg : self.pivotImg;
                console.log(self.filesExist, self.extractFile(fileFound),
                    "list file .done");
                self.genMessage("readdir");
                resolve();
            } else {
                fs.emptyDir(parentDir, err1 => {
                    if (err1) {
                        console.log("files error", err);
                        //reject(process.exit('0'));
                    }
                    self.genMessage("emptydir");
                    console.log("Creating Project here", err);
                    resolve();
                });
            }
        });
    }
    gsFailOver(){
        return new Promise((w,f)=>{
            setTimeout(()=>{
                //selfer.getScreensP(w,f);
                w(true);
            },9000);
        });
    }
    async getScreens(){
        try {
            await Promise.race([
                this.gsFailOver(),
                selfer.page.goto(selfer.testLocations,{waitUntil:"load",timeout:0})
            ]).catch((e)=>{console.log(e,selfer.testLocations,selfer.fileName)});
            //let data = await selfer.page.evaluate(()=>document.body.innerHTML);
            //await waitInSec(6);
            //console.log(data);
            await selfer.page.screenshot({path: selfer.fileName, fullPage: true});
        } catch (e) {
            console.error(e,"from",selfer.testLocations,selfer.fileName);
        }
    }
    getScreensP (resolve,reject) {
        let self = selfer;
        //console.log(self);

        try {
            console.log(self.fileName, "attempt for image");
            // webshot(self.testLocations, self.fileName, self.options, function(err) {
            //     //console.log(self);
            //     if (err) {
            //         console.log(err.trace);
            //         reject(err);
            //     }
            //    console.log("Building test cases", self.fileName);
            //     resolve(true);
            // });
            //if (self.page) resolve(self.page.screenshot({fullPage:true,path:self.fileName}));
        } catch (ex) {
            console.log("exception getscreen", ex);
            reject(ex);
        }
    }
    arrayToPath (arr) {
        return arr.join('/');
    }
    getParentDir (path)  {
        try {
            let splitPath = path.split('/');
            splitPath.pop();
            return this.arrayToPath(splitPath);
        } catch (ex) {
            console.log(ex);
        }
    }
    extractFile (filePath) {
        let arr = filePath.split("/"); //unix/unix-like
        arr.reverse();
        return arr[0];
    }
    runDiff (pivot, changed ) {
        return new Promise(function(done,reject){
            let self = this;
            try {
                resemble(pivot)
                .compareTo(changed)
                    .ignoreNothing()
                    .onComplete(function(data) {
                    // if (self.filesExist.pivot && self.filesExist.test)

                    if (data.misMatchPercentage > 5) {
                        console.log("name:" + name + ",datafailed:true", self.diff_img);
                        data.getDiffImage().pack().pipe(fs.createWriteStream(self.diff_img));
                        done(self.diff_img);
                        // self.genMessage("mismatchY",data.misMatchPercentage);
                    } else {
                        console.log("name:" + name + ",datafailed:false");
                        done("neglegible difference");
                        // self.genMessage("mismatchN",data.misMatchPercentage);
                    }
                    // self.logToDataBase("update test set t_val='"
                    //     +data.misMatchPercentage + "' where id="+self.project_id+";");
                });
            } catch (ex) {
                reject(ex);
            }
        });

    }

    logToDataBase (qry) {
        let self = selfer;
        try{
            if (this.project_id !== 0)
                selfer.dbi.db.all(qry, function(err, row) {
                    if (err){
                        console.log(err,qry,"logToDb Failed");
                    }
                    else
                        console.log(qry,"log in to db");
                });
            else{
                            console.log('no project_id');
            }
        }catch(ex){
            console.log("logToDataBase failed",ex,qry);
        }
    }

    async md(filePath){
        try {
            await fs.ensureDir(filePath);
        } catch (e) {
            fs.mkdirSync(filePath);
            fs.chmodSync(filePath, 777);
        }
    }
    async visual_diff(img1,img2,img_diff){
        selfer.diff_img = img_diff;
        await selfer.runDiff(img1,img2);//?? deprecate
    }

}
module.exports = UserJourney;