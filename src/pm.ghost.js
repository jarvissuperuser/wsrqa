const PM = require("./post_mn");
const CFG  = require("./setup");

let pm = new PM();
let cfg = new CFG();
cfg.init("app.ini");
let files =  {};
let copy1 = [],copy2 = [];
( async function main() {
	// await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb", function (response) {
	// 		const res_data = (response.resp);
	// 		console.log("\x1b[34m\n",
	// 			"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
	// 			" |       HOME Page: Articles & Content Type        |\n" +
	// 			" +++++++++++++++++++++++++++++++++++++++++++++++++++", "\x1b[0m");
	// 		try {
	// 			res_data.forEach((r) => {
	// 				console.log("\x1b[31m", r.article.title, "\x1b[0m \x1b[33m", r.article.content_type, "\x1b[0m");
	// 				copy1.push(r.article.title);
	// 			});
	// 		} catch (e) {
	// 			console.log(res_data);
	// 		}
	// 	}, {
	// 		method: "POST",
	// 		json:
	// 			{
	// 				status: "featured",
	// 				limit: 24,
	// 				offset: 0,
	// 				publication: "dispatch-live",
	// 				section: "home"
	// 			}
	// 	}
	// );
	await pm.sendRequest(cfg.get_url('bl')+'/apiv1/auth/consumer/get-all',function (resp) {
		let data = resp.json();
		console.log(data[0].consumer_secret);
		files['secret'] = data[1].key;
	});
	await pm.sendRequest('http://cosmos-stage-qa.appspot.com/apiv1/auth/consumer/get?key='+files.secret,function (res) {
		console.log(res.resp,res.statusCode,cfg.get_url('bl'));
	}).catch((e)=>{console.log(e)});
	await pm.sendRequest('http://cosmos-stage-qa.appspot.com/apiv1/company/get-all',function (res) {
		console.log(res.resp,res.statusCode,cfg.get_url('bl'));
	}).catch((e)=>{console.log(e)});
	await pm.sendRequest('http://admin.cosmos-stage-qa.appspot.com/apiv1/financial/calendar/get-all?consumer_key='+files.secret,function (res) {
		console.log(res.resp,res.statusCode,cfg.get_url('bl'));
	}).catch((e)=>{console.log(e)});
	await pm.sendRequest(`http://admin.cosmos-stage-qa.appspot.com/apiv1/auth/issue-request-token?consumer_key=${files.secret}&agent=tim`,function (res) {
		console.log(res.resp,res.statusCode,cfg.get_url('bl'));
		files['request_token'] = res.json().token;
		files['request_secret'] = res.json().secret;
	}).catch((e)=>{console.error(e)});
	await pm.sendRequest(`http://admin.cosmos-stage-qa.appspot.com/apiv1/auth/issue-access-token?`+
	`request_token=${files.request_token}`,function (res) {
		/// ** console.log(res.resp,res.statusCode,cfg.get_url('bl'));
		files['access_token'] = res.json().token;
		files['access_secret'] = res.json().secret;
	},{
		method:"POST",
		form:{
			username:"mugadzatt01@gmail.com",
			password:"Ttm331371"
		}
		}).catch((e)=>{console.error(e)});

	//highly unlikely but not secure
	await pm.sendRequest("https://cosmos.dispatchlive.co.za/apiv1/workflow/get-all",function (response) {
		const res_data = ( response.resp );
		console.log("\x1b[34m\n",
			"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
			" |       News Page: Articles & Content Type        |\n" +
			" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
		try {
			res_data.some((r)=>{
				console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type, r.article.plain_text.substr(0,10),"\x1b[0m");
				return r.article.content_type === "premium";
			});
		}catch (e) {
			console.log(res_data);
		}
	},{
		method:"POST",
		json:
			{
				status:"featured",
				limit:24,
				offset:0,
				publication:"dispatch-live",
				section:"news"
			}
	});
	await pm.sendRequest(cfg.get_url('bl')+"/apiv1/pub/articles/get-all?access_token="+files.access_token,function (response) {
		const res_data = ( response.resp );
		console.log("\x1b[34m\n",
			"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
			" |       Pubs Page: Articles & Content Type        |\n" +
			" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
		try {
			res_data.some((r)=>{
				console.log("\x1b[31m",r.title ,"\x1b[0m \x1b[33m", r.content_type, r.plain_text.substr(0,10),"\x1b[0m");
				return r.content_type === "registration";
			});
		}catch (e) {
			console.log(res_data);
		}
	},{
		method:"POST",
		json:
			{
				status:"featured",
				limit:24,
				offset:0,
				publication:"bl",
				section:"home"
			}
	});
})();