const UJMan = require("./userjourney");
const CFG = require("./setup");
// const jd = require("diff");

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
	await u.page.waitFor(1000);
	if (typeof await btns === "object")
	for(let i = 0; i < btns.length;i++){
		await u.page.waitFor(2000);
		const button = await btns[i].asElement();
		await button.click().catch(e=>console.log(e.message,i));
		await u.page.waitFor(3000);
		await u.page.click(".prev-slide").catch(e=>console.log(e.message,i));
		await u.page.waitFor(3000);
	}
	await u.browser.close();
})();