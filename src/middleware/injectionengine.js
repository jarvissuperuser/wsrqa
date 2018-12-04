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





let pubQuery = async (p,m,b_path,new_path)=>{
	let data_accumulated = {};
	switch (p) {
		case '*':
			let obj = config.setup.empty;
			data_accumulated["results"] = [];
			for(let singleton in obj){
                console.log(singleton);
				let result = await sectionQuery(singleton);
				data_accumulated.results.push(result);
				data_accumulated[singleton] = result;
			}
			break;
		default:
			await runTestNative(p,m,b_path,new_path);
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
	}
	return result;
};
