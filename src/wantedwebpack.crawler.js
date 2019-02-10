const PM = require("./post_mn");
const CFG =  require("./setup");
let pm = new PM();
let cfg = new CFG();
cfg.init("./app.ini");
const p = 'tl';
let copy1 = [],copy2 = [];
( async function main() {
	// await pm.sendRequest(cfg.get_url(p)+"/apiv1/workflow/get-all",function (response) {
	// 		const res_data = ( response.resp );
	// 		console.log("\x1b[34m\n",
	// 			"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
	// 			" |       HOME Page: Articles & Content Type        |\n" +
	// 			" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
	// 		try {
	// 			res_data.forEach((r)=>{
	// 				console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
	// 				copy1.push(r.article.title);
	// 			});
	// 			console.log(res_data.length);
	// 		}catch (e) {
	// 			console.log(res_data);
	// 		}
	// 	},{
	// 		method:"POST",
	// 		json:
	// 			{
	// 				status:"featured",
	// 				limit:24,
	// 				offset:0,
	// 				publication:p,
	// 				section:"news"
	// 			}
	// 	}
	// );
	await pm.sendRequest(cfg.get_url(p)+"/news/?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
			const res_data = ( response.resp );
			try {
				console.log("\x1b[34m",
					"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
					" |                tl-stage Articles                |\n" +
					" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				let regex = /<span class="article-title">[\s\S].*?<\/span>+/gsi;
				let regex2 = /<span class="article-title">[\s\S].*?<\/span>+/gsi;
				let regex3 = /<span class="article-title">[\s\S].*?<\/span>+/gsi;
				let result = regex.exec(res_data);
				copy1.push(result[0].replace("<span  class>", "").replace("</span>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				for(let a = 0;a<2;a++) {
					result = regex2.exec(res_data);
					//console.log(result[0].replace("<h3>", "").replace("</h3>", "").trim(), regex2.lastIndex);
					copy1.push(result[0].replace("<span>", "").replace("</span>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				}
				for(let a = 0;a<2;a++) {
					result = regex3.exec(res_data);
					copy1.push(result[0].replace("<span>", "").replace("</span>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				}
				for(let a = 0;a<10;a++) {
					result = regex.exec(res_data);
					copy1.push(result[0].replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").replace("<span class", "").replace("</span>", "").trim());
				}
				copy1.forEach((t)=>{
					console.log("\x1b[31m",t,"\x1b[0m")
				});

			}catch (e) {
				console.log("failed",e.message);
			}
		}
	);


	await pm.sendRequest("https://b.marfeelcache.com/tl-st-staging.appspot.com/news/?marfeeldt=s",function (response) {
			const res_data = ( response.resp );
			try {
				console.log("\x1b[34m",
					"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
					" |                 Marfeel Articles                |\n" +
					" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				let regex = /<h1[\s\S].*?<\/h1>+/gsi;
				// let regex2 = /<h3>[\s\S].*?<\/h3>+/gsi;
				// let regex3 = /<h4>[\s\S].*?<\/h4>+/gsi;
				let result = regex.exec(res_data);
				// console.log(result);
				copy2.push(result[0].replace('<h1 class=mrf-article__title>', "").replace("</h1>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				for(let a = 0;a<10;a++) {
					result = regex.exec(res_data);
					// console.log(result[0].replace('<h1 class=mrf-article__title>', "").replace("</h1>", "").trim(), regex.lastIndex);
					copy2.push(result[0].replace('<h1 class=mrf-article__title>', "").replace("</h1>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				}
				// for(let a = 0;a<2;a++) {
				// 	result = regex3.exec(res_data);
				// 	copy2.push(result[0].replace("<h4>", "").replace("</h4>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
				// }
				// for(let a = 0;a<10;a++) {
				// 	result = regex.exec(res_data);
				// 	copy2.push(result[0].replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").replace("<h2>", "").replace("</h2>", "").trim());
				// }
				copy2.forEach((t)=>{
					console.log("\x1b[31m",t,"\x1b[0m")
				});

			}catch (e) {
				console.log("failed",e.message);
			}
		}
	);

	// fetch("https://b.marfeelcache.com/tl-st-staging.appspot.com/news/?marfeeldt=s", {"credentials":"omit","referrer":"https://tl-st-staging.appspot.com/news/","referrerPolicy":"unsafe-url","body":null,"method":"GET","mode":"cors"});


	//compare cp1 vs cp2 diff
	// console.log("\x1b[34m",
	// 	"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
	// 	" |          Premium Found On All Pages             |\n" +
	// 	" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
	// let article_count = 0;
	// let found_articles = [];
	// copy1.forEach((title)=>{
	// 	copy2.some((title2)=>{
	// 		if (title.indexOf(title2.replace("...","").trim())>=0){
	// 			console.log(title,"\x1b[33m" ,title2 ,"\x1b[32m", ":FOUND","\x1b[0m");
	// 			article_count++;
	// 			found_articles.push(title2);
	// 			return true;
	// 		}
	// 	});
	// });
	// console.log("\x1b[32m","Spread of Premium Articles Count:", article_count,"\x1b[0m");
	// article_count =0;
	// console.log("\x1b[34m",
	// 	"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
	// 	" |      Premium representation On All Pages        |\n" +
	// 	" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
	// copy2.forEach((title)=>{
	// 	found_articles.some((title2)=>{
	// 		if (title.indexOf(title2.replace("...","").trim())>=0){
	// 			console.log(title,"\x1b[33m" ,title2 ,"\x1b[32m", ":FOUND","\x1b[0m");
	// 			article_count++;
	// 			return true;
	// 		}
	// 	});
	// });
	// console.log("\x1b[32m","Representation:", article_count/copy2.length*100,"%\x1b[0m");
})();