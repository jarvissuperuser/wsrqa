const UJMan = require("./userjourney");
const CFG = require("./setup");
const PM = require("./post_mn");
// const jd = require("diff");

let u = new UJMan();
let config = new CFG();
let pm = new PM();
const p = 'bl';
let success = false;
let foundOffer = true;
let build = null;
let pageOffer = [];
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

let wordingTest = async (input = [], offerBody = "")=> {
    let score = {};
    score.win = 0;
    score.failed = [];
    const wording = input.hasOwnProperty("length")?input:input.split('\n');
    if (wording.hasOwnProperty('length')){
        wording.forEach(async (phrase,index)=>{
            score.win = offerBody.contains(phrase)?score.win+1:score.win;
            if(!offerBody.contains(phrase))score.failed.push(index);
        });
        score.result = wording / score.win;
    }
    return score;
};

(async function main() {
	await u.initBrowser('1366x768');
	const auth = await getAuthToken(p);
	await u.page.goto(config.get_url(p,'buy') + `?access_token=${auth}`);
	await u.page.screenshot({path:"./payWall.png"});
	const btns = await u.page.$$('.subscribe');
	const texts = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.subscribe' ),
			element => element.getAttribute("data-offer")))
		.catch(e=>console.log(e.message));
	const textDump = u.page.evaluate(()=>Array.from(document.querySelectorAll('body'),element=>element.innerText));
	pageOffer = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.subscribe' ),
			element =>
				element.parentElement.parentElement.querySelector(".price").innerText.substr(1)))
		.catch(e=>{console.log(e.message);foundOffer= false});


	//for businesslive
	if (!foundOffer) {
		foundOffer =true;
		pageOffer = await u.page.evaluate(() => Array.from(document.querySelectorAll('.subscribe'),
			element =>
				element.parentElement.parentElement.querySelector("u").innerText.substr(1)))
			.catch(e => {
				console.log(e.message);
				foundOffer = false;
			});
	}
    //for sunday-times
    if (!foundOffer) {
        foundOffer = true;
        pageOffer = await u.page.evaluate(() => Array.from(document.querySelectorAll('.subscribe'),
            element =>{
                return [
                    element.parentElement.cellIndex,
                    parentElement.parentElement.parentElement.innerText,
                    element.innerText
                ]

            })).catch(e => {
            console.log(e.message);
            foundOffer = false;
        });
    }
	await u.page.waitFor(1000);
	if (typeof await btns === "object")
	for(let i = 0; i < btns.length;i++){
		success =true;
		await u.page.waitFor(2000);
		const button = await btns[i].asElement();
		await button.click().catch(e=>{console.log(e.message,i);success = false;});
		await u.page.waitFor(3500);
		if (success) {
			await u.page.screenshot({path:`./offer${i}.png`,fullPage:true});
			//console.log(JSON.parse(texts[i]).options[0].price === Math.ceil( pageOffer[i]));
			if (foundOffer)
			await pm.test(`Offer ${i} File Price to be ${pageOffer[i]}`,async function () {
				let price = 0;
			    if (JSON.parse(texts[i])) {
			    	let obj = JSON.parse(texts[i]).options[0];
			    	price = obj.phase1_price?obj.phase1_price:obj.price;
					await pm.expect(Math.ceil(pageOffer[i])).to.equal(price);
				}
			    else
			        console.log(texts[i]);
			});
			await u.page.click(".prev-slide").catch(e=>console.log(e.message,i));
		}
		await u.page.waitFor(3000);

	}
	await u.browser.close();
})();