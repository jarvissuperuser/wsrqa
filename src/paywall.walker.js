const UJMan = require("./userjourney");
const CFG = require("./setup");

let u = new UJMan();
let config = new CFG();
const p = 'tl';
config.init("./app.ini");
(async function main() {
	await u.initBrowser('1366x768');
	await u.page.goto(config.get_url(p,'buy'));
	const btns = await u.page.$$('.subscribe');
	const texts = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.subscribe' ), element => element.outerHTML ) );
	await u.gsFailOver();
	console.log("btns :",btns.length);
	for(let i = 0; i < btns.length;i++){
		await u.page.$eval(".subscribe",btn => btn[i].click());
		await u.gsFailOver();
		await u.page.goto(config.get_url(p,'buy'));
	}
	await u.browser.close();
})();