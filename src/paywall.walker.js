const UJMan = require("./userjourney");
const CFG = require("./setup");
const PM = require("./post_mn");
// const jd = require("diff");

let u = new UJMan();
let config = new CFG();
let pm = new PM();
const p = 'tl';
let success = false;
let is_logged_in = false;
let build = null;
config.init("./app.ini");

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

(async function main() {
	await u.initBrowser('1366x768');
	const auth = await getAuthToken(p);
	await u.page.goto(config.get_url(p,'buy') + `?access_token=${auth}`);
	await u.page.screenshot({path:"./payWall.png"});
	const btns = await u.page.$$('.subscribe');
	const texts = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.subscribe' ), element => element.getAttribute("data-offer")));
	await u.page.waitFor(1000);
	if (typeof await btns === "object")
	for(let i = 0; i < btns.length;i++){
		success =true;
		await u.page.waitFor(2000);
		const button = await btns[i].asElement();
		await button.click().catch(e=>{console.log(e.message,i);success = false;});
		await u.page.waitFor(3000);
		if (success) {
			await u.page.screenshot({path:`./offer${i}.png`,fullPage:true});
			console.log(texts[i]);
		}
		await u.page.click(".prev-slide").catch(e=>console.log(e.message,i));
		await u.page.waitFor(3000);
	}
	await u.browser.close();
})();