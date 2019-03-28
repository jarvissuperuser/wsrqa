/***
 * @doc regression middleware
 * @version module 0.0.2
 *
 * **/

const Setup = require("../setup");
const UJC = require('../userjourney');
const Logger = require('../multiLogger');
const PM = require('../post_mn');
const fs = require('fs-extra');

let uj = undefined;
let pm  = new PM();
let log = new Logger();
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
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
		console.log(res.json().token,res.statusCode,config.get_url(p));
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

let articleCrosswords = async (p = "st",m = "crosswords") => {
	let oldEnv = config.env;
	config.env = "live";
	let at = await getAuthToken(p,['',"mugadzat@tisoblackstar.co.za","Ttm331371"]);
	let col = {};
	if (config.get_values(p,m)){
		uj.name = config.get_values(p,"path")+`${p}`;let app = config.get_values(p,m);
		for(let i in app){
			let url = app[i];
			uj.fileName = `${uj.name}_${m}_${i}_${uj.timestamp}.png`;
			await Promise.race([uj.page.goto(`${config.get_url(p)}${url}?access_token=${at}`),uj.waitFor(4000)]);
			let leagueB = await uj.getElementInFrame("https://cdn2.amuselabs.com", `li:first-child`);
			await delay(3);
			await leagueB.click().catch(e=>console.log(e.message));
			console.log("crosswords" , i);
			await delay(3);
			await uj.page.screenshot({path:uj.fileName,fullPage:true});
			const db= await log.log(m+url,uj.fileName,'log_info',1);
			col[`${m}${i}`] = {file:uj.fileName,db:db};
		}
	}
	config.env = oldEnv;
	return col;
};

let sportLiveEngine = async (p = "sl",m = "sportlive", instruction = "")=>{
	let full = [],col = {};
	if (config.get_values(p,m)){
		let sportlivePoints = config.get_values(p,m);
		uj.testLocations = config.get_section(p,'sport') + `${m}/`;
		uj.name = config.get_values(p,'path') + `${p}_${m}`;
		await Promise.race( [ uj.gsFailOver() , uj.page.goto(uj.testLocations) ]);
		for (let btn = 0;btn < sportlivePoints.football.length;btn++){
			let league = sportlivePoints.football[btn];col = {};
			uj.fileName = uj.name +`_${league}_${uj.timestamp}.png`;
			let leagueB = await uj.getElementInFrame(
				"https://team-talk-158109.appspot.com/sport/football/",
				`li#${league}`);
			await leagueB.click();
			await delay(5);
			await uj.page.screenshot({path:uj.fileName,fullPage:true});
			const msg = `${m} League:${league.toUpperCase()}`;
			col['league'] = league.toUpperCase();
			col['db'] = await log.log(msg,uj.fileName,'log_info',1);col['file'] = uj.fileName;
			console.log(col);
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
		collection["after_login"] = {} ;
		collection["login_no"] = {} ;//
        await uj.login_(config.get_url(p,'login'));
        let l_pic =  uj.name + `_login_complete_${uj.timestamp}.png`;
        let e_pic = `${uj.name}` + `_login_email_${uj.timestamp}.png`;
        collection["after_login"]['file'] = l_pic ;
        collection["login_no"]['file'] = e_pic ;
        await uj.page.screenshot({path: l_pic});
        const msgLog_ =  "login no password @ " + uj.timestamp;
        let insert_ = await log.log(msgLog_,e_pic,"log_info",1);
        console.log("Logged @",insert_);
        const msgLog = "login @ " + uj.timestamp;
        let insert = await log.log(msgLog,l_pic,"log_info",1);
        console.log("Logged @",insert);
        collection['after_login']['db'] = insert;
		collection["login_no"]['db'] = insert_;
        collection["after_login"]['auth'] = await authQuery(p);
    }
    return collection;
};

let pubSectionQuery =
	async (p,m,cred = ["blank", "mugadzatt01@gmail.com", "Ttm331371"]) =>{
	let data_accumulated = {};
	data_accumulated[m==="*"&& m?"all":m] = [];
	switch (m) {
		case "*":

			data_accumulated.section = [];
            let result = await sectionQuery(p);
            data_accumulated.section.push(result);
            data_accumulated["login"] = [];
            result = await loginQuery(p,cred);
            data_accumulated.login.push(result);
            data_accumulated["crossword"] = [];
            result = await articleCrosswords(p);
            data_accumulated.crossword.push(result);
            data_accumulated["sportlive"] = [];
            result = await sportLiveEngine(p);
            data_accumulated.sportlive.push(result);
            console.log(result);
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
			let res = await sportLiveEngine(p);
			data_accumulated.sportlive.push(res);
			console.log(res);
			break;
		case "crosswords":
			let res_ = await articleCrosswords(p);
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
	let path = config.get_values(p,'path');
	fileList[p] = [];
	for(let url in url_list){
		let section = url_list[url].split('/').reverse()[1];
		console.log(section);
		uj.fileName = `${path}${p}_${section}_${uj.timestamp}.png`;
		await Promise.race( [ uj.gsFailOver() , uj.page.goto(url_list[url]) ]);
		await uj.page.screenshot({path:uj.fileName, fullPage:true });
		let id = await log.log("Logged Section",uj.fileName,'log_info',1);
		fileList[p].push({section:section,file:uj.fileName,db:id});
	}
	//add
	uj.fileName = `${path}${p}_empty_${uj.timestamp}.png`;
	await Promise.race( [ uj.gsFailOver() , uj.page.goto(config.get_url(p)) ]);
	await uj.page.screenshot({path:uj.fileName, fullPage:true });
	let id = await log.log("Logged Section",uj.fileName,'log_info',1);
	fileList[p].push({section:"empty",file:uj.fileName,db:id});
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

let hasProp = (path = [],obj={})=>{
	let o = obj;
	let found = true;
	return path.every(e=>{
		found = o.hasOwnProperty(e);
		// console.log("has prop",e,found,path);
		o = o.hasOwnProperty(e)?o[e]:undefined;
		return found;
	});
};
let getProp = (path = [],obj = {}) =>{
	let o = obj;
	let found = true;
	path.every(e=>{
		found = o.hasOwnProperty(e);
		o = o.hasOwnProperty(e)?o[e]:undefined;
		return found;
	});
	return o;
};
let read = (filename) => {
	return fs.readJsonSync(filename);
};
let write = (filename,data) => {
	console.log(filename,'written');
	fs.writeJsonSync(filename,data);
};
let compare = (d1 = {}, d2 = {}) => {
	let result = {};
	let path = [];

	try {
		for (let data in d1) {
			console.log(`data >> ${data}`);
			let infoLevel1 = d1[data];

			for (let inner1  in  infoLevel1){
				if (inner1 === 'section')
					console.log(`\tinner 1 >> ${inner1}`);
				infoLevel1[inner1].forEach((e,i)=>{
					if(e[data]){
						e[data].forEach(async (element,index)=>{
							path.push(data);path.push(inner1);path.push(i);path.push(data);path.push(index);
							if (hasProp(path,d2)) {
								result[data] = result[data]?result[data]:{};
								result[data][element.section] = result[data][element.section]?result[data][element.section]:{};
								console.log("\t\td2>>", d2[data][inner1][i][data][index].file);
								console.log("\t\td1>>", d1[data][inner1][i][data][index].file);
								uj.diff_img = `${data}.${d2[data][inner1][i][data][index].section}.${uj.timestamp}.diff.png`;
								console.log('\t\tdiff>>',uj.diff_img,element.section);
								//await uj.runDiff(d1[data][inner1][i][data][index].file,d2[data][inner1][i][data][index].file);
								result[data][element.section].f1 = d1[data][inner1][i][data][index].file;
								result[data][element.section].f2 = d2[data][inner1][i][data][index].file;
								result[data][element.section].diff = uj.diff_img;
							}
							path = [];
						});
					}
				});

				if (inner1 === 'sportlive') {
					console.log(`\tinner 1 >> ${inner1}`,'infoLevel1[inner1][0]');
					infoLevel1[inner1][0].forEach((element,index)=>{
						path.push(data);path.push(inner1);path.push(0);path.push(index);
						if(hasProp(path,d2)) {
							result[data] = result[data] ? result[data] : {};
							result[data][element.league] = result[data][element.league]?result[data][element.league]:{};
							let obj2 = getProp(path,d2);
							let obj1 = getProp(path,d1);
							console.log("\t\td2>>", obj2.file);
							console.log("\t\td1>>", obj1.file);
							uj.diff_img = `${data}.${obj2.league}.${uj.timestamp}.diff.png`;
							console.log('\t\tdiff>>',uj.diff_img,element.league);
							//await uj.runDiff(d1[data][inner1][i][data][index].file,d2[data][inner1][i][data][index].file);
							result[data][element.league].f1 = obj1.file;
							result[data][element.league].f2 = obj2.file;
							result[data][element.league].diff = uj.diff_img;
						}
						path = []
					});
				}

				//FIXME
				if (inner1 === 'crossword' && data ==='st') {
					console.log(`\tinner 1 >> ${inner1}`, 'infoLevel1[inner1][0]');
					for(let element in infoLevel1[inner1][0]){
						// console.log(element," count");
						path.push(data);path.push(inner1);path.push(0);path.push(element);
						// console.log(element," count", hasProp(path,d2));
						if(hasProp(path,d2)) {
							result[data] = result[data] ? result[data] : {};
							result[data][element] = result[data][element]?result[data][element]:{};
							let obj2 = getProp(path,d2);
							let obj1 = getProp(path,d1);
							console.log("\t\td2>>", obj2.file);
							console.log("\t\td1>>", obj1.file);
							uj.diff_img = `${data}.${element}.${uj.timestamp}.diff.png`;
							console.log('\t\tdiff>>',uj.diff_img,"crosswords");
							result[data][element].f1 = obj1.file;
							result[data][element].f2 = obj2.file;
							result[data][element].diff = uj.diff_img;
						}
						path = []
					}// * */
				}
				if (inner1 === 'login') {
					console.log(`\tinner 1 >> ${inner1}`,'infoLevel1[inner1]');
					for(let element in infoLevel1[inner1][0]){
						path.push(data);path.push(inner1);path.push(0);path.push(element)
						//console.log(element);
						if(hasProp(path,d2)) {
							result[data] = result[data] ? result[data] : {};
							result[data][element] = result[data][element]?result[data][element]:{};
							let obj2 = getProp(path,d2);
							let obj1 = getProp(path,d1);
							console.log("\t\td1>>", obj1.file);
							console.log("\t\td2>>", obj2.file);
							uj.diff_img = `${data}.${element}.${uj.timestamp}.diff.png`;
							console.log('\t\tdiff>>',uj.diff_img);
							result[data][element].f1 = obj1.file;
							result[data][element].f2 = obj2.file;
							result[data][element].diff = uj.diff_img;
						}
						path = []
					}//*/
				}

			}

		}
	}
	catch (e) {
		console.log(e.message , ">> error");
	}
	return result;
};

let diff = async (com)=>{
	for (let pub in com){
		for (let aspect in com[pub]){
			uj.diff_img = com[pub][aspect].diff;
			console.log(com[pub][aspect].diff,pub);
			let img = await uj.runDiff(com[pub][aspect].f1, com[pub][aspect].f2).catch(e => console.log(e.message));
			if (img !== "neglegible difference"){
				await pm.sendRequest("https://hooks.slack.com/services/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",function (r) {
					console.log("SentMessage>> ",r.resp);
				},{method:"POST",json:{
						text:`Pub:${pub} SECTION:${aspect} \nDIFF: ${img} \nIMG0: ${com[pub][aspect].f1} \nIMG1:${com[pub][aspect].f2}`
					}});
			}
		}
	}//*/
};

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
	let fileName = `${p==='*'?'all':p}.result.json`;
	let fileLatest = `${p==='*'?'all':p}.${uj.timestamp}.json`;
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


		result = await pubQuery(p,m,b_path,new_path);
		let fileExists = await fs.pathExists(fileName);
		if (t === "yes"){

			if (fileExists) {
				let latest = read(fileName);

				let com = compare(latest,result);
				await diff(com);
				write(fileLatest,result);


			} else {
				//save file
				write(fileName,result);
			}
		}
		console.log("done");
		await uj.closeBrowser();
	}catch (e) {
		console.log(e, "from" ,uj.name , uj.testLocations);
		// this.promise.done = true;
	}
	return result;
};
