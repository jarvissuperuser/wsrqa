const Setup = require("../setup");
const UJC = require('../userjourney');
const Logger = require('../multiLogger');
const PM = require('../post_mn');

let uj = undefined;
let pm  = new PM();
let log = new Logger();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const mobileAgent = '';
let project = '';
let isMobile = '';
let runTests = '';
let new_path = '';
let special_tag = '';
let config = new Setup();


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

let projects = {
	"tl_home": "timeslive",
	"tl_article": "timeslive",
	"bl_home": "businesslive",
	"sl_home": "sowetanlive",
	"wo_home": "wanted"
};
let getAccessToken = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"]) => {
	await pm.login(config.get_url(p,'login'),cred[1],cred[2], async function (response) {
		console.log(response);
	});
	return {};
};
let payWallQuery = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"]) => {
	await pm.login(config.get_url(p,'login'),cred[1],cred[2], async function (response) {

    });
};
let getAuthToken = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"])=>{
	let files = {};
	await pm.sendRequest(config.get_url(p)+'/apiv1/auth/consumer/get-all',function (resp) {
		let data = resp.json();
		console.log(data[0].consumer_secret);
		files['secret'] = data[0].key;
	});
	await pm.sendRequest(config.get_url(p)+'/apiv1/company/get-all',function (res) {
		console.log(res.resp,res.statusCode,config.get_url(p));
	}).catch((e)=>{console.log(e)});
	await pm.sendRequest(config.get_url(p)+'/apiv1/financial/calendar/get-all?consumer_key='+files.secret,function (res) {
		//console.log(res.resp,res.statusCode,config.get_url(p));
	}).catch((e)=>{console.log(e)});
	await pm.sendRequest(config.get_url(p)+`/apiv1/auth/issue-request-token?consumer_key=${files.secret}&agent=tim`,function (res) {
		//console.log(res.resp,res.statusCode,config.get_url(p));
		files['request_token'] = res.json().token;
		files['request_secret'] = res.json().secret;
	}).catch((e)=>{console.error(e)});
	await pm.sendRequest(`${config.get_url(p)}/apiv1/auth/issue-access-token?`+
		`request_token=${files.request_token}&username=${cred[1]}&password=${cred[2]}`,function (res) {
		//console.log(res.resp,res.statusCode,cfg.get_url(p));
		files['access_token'] = res.json().token;
		files['access_secret'] = res.json().secret;
	}).catch((e)=>{console.error(e)});
	return files.access_token;
};

let articleCrosswords = async (p = "st",m = "crosswords") => {
	let at = await getAuthToken(p,['',"mugadzat@tisoblackstar.co.za","Ttm331371"]);
	let col = {};
	if (config.get_values(p,m)){
		uj.name = config.get_values(p,"path")+`${p}`;let app = config.get_values(p,m);
		for(let i in app){
			let url = app[i];
			uj.fileName = `${uj.name}_${m}_${i}_${uj.timestamp}.png`;
			await uj.page.goto(`${config.get_url(p)}${url}?access_token=${at}`);
			let leagueB = await uj.getElementInFrame("https://cdn2.amuselabs.com", `li:first-child`);
			await delay(3);
			console.log(await leagueB.click().catch(e=>console.log(e.message)));
			await delay(3);
			await uj.page.screenshot({path:uj.fileName,fullPage:true});
			const db= await log.log(m+url,uj.fileName,'log_info',1);
			col[`${m}${i}`] = {file:uj.fileName,db:db};
		}
	}
	return col;
};

let sportLiveEngine = async (p = "sl",m = "sportlive", instruction = "")=>{
	let col = {}, full = [];
	if (config.get_values(p,m)){
		let sportlivePoints = config.get_values(p,m);
		uj.testLocations = config.get_section(p,'sport') + `${m}/`;
		uj.name = config.get_values(p,'path') + `${p}_${m}`;
		await Promise.race( [ uj.gsFailOver() , uj.page.goto(uj.testLocations) ]);
		for (let btn = 0;btn < sportlivePoints.football.length;btn++){
			let league = sportlivePoints.football[btn];
			uj.fileName = uj.name +`_${league}_${uj.timestamp}.png`;
			let leagueB = await uj.getElementInFrame(
				"https://team-talk-158109.appspot.com/sport/football/",
				`li#${league}`);
			await leagueB.click();
			await delay(5);
			await uj.page.screenshot({path:uj.fileName,fullPage:true});
			const msg = `${m} League:${league.toUpperCase()}`;
			col['db'] = await log.log(msg,uj.fileName,'log_info',1);col['file'] = uj.fileName;
			full.push(col);
		}
	}
	return full;
};

let authQuery = async (p) => {
    await delay(2);
    let ck = "";
    let cookies = await uj.page.cookies(config.get_url(p));
	cookies.some((cookie)=>{
        if (cookie.name === "_cosmos_auth"){
            ck = (cookie.value);
            return true;
        }
    });
	return ck;
};

let loginQuery = async (p,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"]) =>{
    let collection = {};
	if (config.get_values(p,"login")) {
        uj.cred = cred;
        uj.name = config.get_values(p,'path') + `${p}` ;
        await uj.login_(config.get_url(p,'login'));
        let l_pic =  uj.name + `_login_complete_${uj.timestamp}.png`;
        let e_pic = `${uj.name}` + `_login_email_${uj.timestamp}.png`;
        collection["after_login"] = l_pic ;
        collection["login_no"] = e_pic ;
        await uj.page.screenshot({path: l_pic});
        const msgLog_ =  "login no password @ " + uj.timestamp;
        let insert_ = await log.log(msgLog_,e_pic,"log_info",1);
        console.log("Logged @",insert_);
        collection['db'] = insert_;
        const msgLog = "login @ " + uj.timestamp;
        let insert = await log.log(msgLog,l_pic,"log_info",1);
        console.log("Logged @",insert);
        collection['db2'] = insert;
        collection["auth"] = await authQuery(p);
    }
    return collection;
};

let pubSectionQuery =
	async (p,m,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"]) =>{
	let data_accumulated = {};
	data_accumulated[m==="*"&& m?"all":m] = [];
	switch (m) {
		case "*":
            let result = await sectionQuery(p);
            data_accumulated.section.push(result);
            data_accumulated["login"] = [];
            result = await loginQuery(p,cred);
            data_accumulated.login.push(result);
            // data_accumulated["payWall"] = [];
            // result = await loginQuery(p);
            // data_accumulated.login.push(result);
			break;
		case "section":
            let r = await sectionQuery(p);
            data_accumulated.section.push(r);
			break;
		case "login":
            let re = await loginQuery(p);
            data_accumulated.login.push(re);
			break;
		case "sportLive":
		case "sportlive":
			let res = await sportLiveEngine();
			data_accumulated.sportlive.push(res);
			break;
		case "crosswords":
			let res_ = await articleCrosswords();
			data_accumulated.crosswords.push(res_);
			break;
        case "payWall":
            // data_accumulated["payWall"] = [];
            // result = await loginQuery(p);
            // data_accumulated.login.push(result);
            break;
		default:
    }
    return data_accumulated;
};

let pubQuery = async (p,m,b_path,new_path)=>{
	let data_accumulated = {};
	switch (p) {
		case '*':
			let obj = config.setup.empty;
			data_accumulated["section"] = [];
			for(let single_pub in obj){
				uj.md(config.get_values(single_pub,'path'));
				data_accumulated[single_pub] = await pubSectionQuery(single_pub,m);
			}
			break;
		default:
            uj.md(config.get_values(p,'path'));
			data_accumulated[p] = await pubSectionQuery(p,m);
	}
	return data_accumulated;
};

let sectionQuery = async (p) =>{
	let url_list = config.get_section_list(p);
	let fileList = {};
	fileList[p] = [];
	for(let url in url_list){
		let section = url_list[url].split('/').reverse()[1];
		console.log(section);
		let path = config.get_values(p,'path');
		uj.fileName = `${path}${p}_${section}_${uj.timestamp}.png`;
		await Promise.race( [ uj.gsFailOver() , uj.page.goto(url_list[url]) ]);
		await uj.page.screenshot({path:uj.fileName, fullPage:true });
		let id = await log.log("Logged Section",uj.fileName,'log_info',1);
		fileList[p].push({section:section,file:uj.fileName,db:id});
	}
	return fileList;
};


let testLocations;


let image_log = async () =>{
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
	let msgs = [];
	switch (m) {
		case "empty":
			// uj.fileName = b_path + uj.name + ".png";
			files.push(uj.fileName);
			image_log();
			await uj.getScreens();
			break;
		case "login":
			if (config.get_values(special_tag,m)) {
				uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
				uj.name = b_path + uj.name;
				await uj.login_(new_path);
				await delay(7);
				let l_pic =  uj.name + "_login_complete.png";
				let e_pic = `${uj.name}_${uj.timestamp}` + "_login_email.png";
				files.push(e_pic);
				files.push(l_pic);
				await uj.page.screenshot({path: l_pic});
				const msgLog_ = m + " no password @ " + uj.timestamp;
				msgs.push(msgLog_);
				let insert_ = await log.log(msgLog_,e_pic,"log_info",1);
				console.log("Logged @",insert_);
				const msgLog = m + " @ " + uj.timestamp;
				let insert = await log.log(msgLog,l_pic,"log_info",1);
				console.log("Logged @",insert);
				msgs.push(msgLog);
			}
			console.log("close ", new_path);
			break;
		case "reset":
			uj.cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"];
			uj.name = b_path + uj.name;
			break;
		case "buy":
			let buy_promise = new Promise((win) => {
				uj.fileName = `${b_path}${uj.name}_${uj.timestamp}` + "_paywall.png";
				console.log(uj.fileName);
				uj.testLocations = new_path;
				files.push(uj.fileName);
				win();
			});
			await buy_promise.then(async () => {
				await uj.page.goto(new_path);
				await uj.page.screenshot(uj.fileName);
				files.push(uj.fileName);
				msgs.push("Paywall")
			}).catch(err => console.log(err));
			break;
		case "sections":
			break;
		default:
			console.log("No Thing");
	}
	return {files:files,msg:msgs};
}

module.exports = async(p, m, t,form = "1366x768") => {
	project = p;
	isMobile = m;
	runTests = t;
	config.init("./app.ini");
	config.env = "live";
	let b_path = "./public/images/";
	let result = {};
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
		b_path = config.get_values(special_tag,"path");
		new_path = config.get_url(special_tag, m==="no"?'empty':m);
		uj.fileName = b_path + uj.name + ".png";
		//uj.testLocations = b_path;
		console.log('web_Path',new_path);
	}catch (e) {
		console.error(e.message);
	}

	try {
		//setup
		await uj.initBrowser(form);
		await uj.md(b_path);
		uj.testLocations = new_path;
		let orName =  b_path + uj.name;
		uj.pivotImg = b_path + uj.name + ".png";
		uj.diff_img = b_path + uj.name + uj.timestamp + "diff.png";
		uj.fileName = b_path + uj.name + uj.timestamp + ".png";
		uj.testImg = uj.fileName + ".png";
		if (t === 'no') {
			result = await pubQuery(p,m,b_path,new_path);
		}
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
		// this.promise.done = true;
	}
	return result;
};
