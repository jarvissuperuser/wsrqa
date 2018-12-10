const UJMan = require("./userjourney");
const CFG = require("./setup");

let u = new UJMan();
let config = new CFG();
const p = 'tl';
config.init("./app.ini");
(async function main() {
	await u.initBrowser('1366x768');
	await u.page.goto(config.get_url(p,'buy'));
	const btns = await u.page.$$('.button.subscribe');
	const texts = await u.page.evaluate( () => Array.from( document.querySelectorAll( '.button.subscribe' ), element => element.outerHTML ) );
	await u.gsFailOver();
	console.log("btns :",btns.length);
	for(let i = 1; i <= btns.length;i++){
		await btns[i].focus();
		//await u.page.focus(`.button.subscribe:nth-of-type(${i})` ).catch(e=>console.log(e.message, texts[i]));
		await u.page.keyboard.type('\n');
		await u.gsFailOver();
		await u.page.goto(config.get_url(p,'buy'));
	}
	await u.browser.close();
})();