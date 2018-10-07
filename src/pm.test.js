const pmn = require("./post_mn");
let pm = new pmn();
let authorisation = "3502fdd826663b85ce1721c780c84404e5326502";

async function tests() {
	let results = await pm.login("http://tl-st-staging.appspot.com/u/sign-in/",
			'mugadzat@tisoblackstar.co.za','Ttm331371',function (body) {
					console.log(body);
			});
	//console.log(results);
	// await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/user/profile?access_token="+authorisation,function (response) {
	// 	let res = response.json();
	// 	let status = response.status();
	// 	let header  = response.getHeader('server');
	// 	let cks = pm.getCookieValue('_cosmos_auth');
	// 	console.log(res.key, ":",":",cks);
	// });
	await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/pub/articles/get?slug=2018-08-02-skeem-saams-pretty-opens-up-about-harassment-in-the-industry&access_token=" + 0, function (response) {
		let res = response.json();
		let status = response.status();
		let header = response.getHeader('server');
		console.log(res.slug, ":", ":", header);
	});

	pm.test("is Premium", function () {
		pm.expect(pm.response.json().content_type).to.equal("premium");
	});
	pm.test("content is not viewable", function () {
		let content = pm.response.json().plain_text;
		console.log(pm.response.getCookie("_cosmos_auth"));
		pm.expect(content).to.equal("~ No Access ~");
	});

	//fetch("http://tl-st-staging.appspot.com/u/sign-in/", {"credentials":"include","headers":{},"referrer":"http://tl-st-staging.appspot.com/u/sign-in/","referrerPolicy":"unsafe-url","body":"email=mugadzatt01%40gmail.com&password=Ttm33137","method":"POST","mode":"cors"});

}

tests();