const UJMan = require("./userjourney");
const CFG = require("./setup");
const jd = require("diff");


let u = new UJMan();
let config = new CFG();
const p = 'tl';
let success = false;
let is_logged_in = false;
let build = null;
config.init("./app.ini");
(async function main() {
	await u.initBrowser('1366x768');
	await u.page.goto(config.get_url(p,'buy'));
	const btns = await u.page.$$('.subscribe');
	const texts = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.subscribe' ), element => element.outerHTML ) );
	await u.page.waitFor(5000);
	//if (jd) {
	let txts = [];
	let val = await btns[3].asElement();
	// console.log(await val);
	await val.click();
	console.log("clicked");
	btns.forEach(async (b,i)=>{
		await b.asElement();
		console.log(b,i);

	});
	await u.page.waitFor(3000);
		// txts.push((await btns[0].toJSON().catch(e=>console.log(e))));
		// txts.push((await btns[1].toJSON().catch(e=>console.log(e))));
		// let df = await jd.diffChars(txts[0], txts[1]);
		// df.forEach((part, i) => {
		// 	if (part.added || part.removed) {
		// 		console.log(part.value, i, part.added ? "added" : "rmvd");
		// 	}
		// });
	//}
	//console.log("btns :",typeof await btns);
	if (typeof await btns === "ElementHandle")
	for(let i = 0; i < btns.length;i++){
		await u.page.waitFor(2000);
		const mouse = u.page.mouse;
		//console.log(await JSON.parse(texts[i]).description, i);
		await u.page.evaluate(()=>{
			var test = document.querySelectorAll(".subscribe");
			test.forEach(async (e)=>{
				console.log(e.outerHTML);
			});
		});
		await u.page.waitFor(2000);
		if (false) {
			await u.gsFailOver();

		}
		await u.page.goto(config.get_url(p, 'buy')).catch((e)=>console.log(e));
	}
	else
		// console.log(typeof  btns);
	u.page.waitFor(4000);
	await u.browser.close();
})();