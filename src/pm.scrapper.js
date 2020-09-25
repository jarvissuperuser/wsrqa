const PM = require("./post_mn");
let pm = new PM();
let copy1 = [],copy2 = [];
( async function main() {
    await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
            const res_data = ( response.resp );
        console.log("\x1b[34m\n",
                    "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                    " |       HOME Page: Articles & Content Type        |\n" +
                    " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
            try {
                res_data.forEach((r)=>{
                    console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
                    copy1.push(r.article.title);
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
                    section:"home"
                }
        }
    );
	await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
				const res_data = ( response.resp );
				console.log("\x1b[34m\n",
						"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
						" |       News Page: Articles & Content Type        |\n" +
						" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				try {
					res_data.forEach((r)=>{
						console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
						copy1.push(r.article.title);
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
			}
	);
	await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
				const res_data = ( response.resp );
				console.log("\x1b[34m\n",
						"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
						" |      Politics Page: Article & Content Type      |\n" +
						" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				try {
					res_data.forEach((r)=>{
						console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
						copy1.push(r.article.title);
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
							section:"politics"
						}
			}
	);
	await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
				const res_data = ( response.resp );
				console.log("\x1b[34m\n",
						"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
						" |      Videos Page: Articles & Content Type       |\n" +
						" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				try {
					res_data.forEach((r)=>{
						console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
						copy1.push(r.article.title);
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
							section:"videos"
						}
			}
	);
	await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
				const res_data = ( response.resp );
				console.log("\x1b[34m\n",
						"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
						" |       Sport Page: Article & Content Type        |\n" +
						" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				try {
					res_data.forEach((r)=>{
						console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
						copy1.push(r.article.title);
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
							section:"sport"
						}
			}
	);
	await pm.sendRequest("http://cosmos.dispatchlive.co.za/apiv1/workflow/get-all?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
				const res_data = ( response.resp );
				console.log("\x1b[34m\n",
						"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
						" |     lifestyle Page: Article & Content Type      |\n" +
						" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
				try {
					res_data.forEach((r)=>{
						console.log("\x1b[31m",r.article.title ,"\x1b[0m \x1b[33m", r.article.content_type,"\x1b[0m");
						copy1.push(r.article.title);
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
							section:"lifestyle"
						}
			}
	);
    await pm.sendRequest("http://www.dispatchlive.co.za/premium/?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb",function (response) {
            const res_data = ( response.resp );
            try {
                console.log("\x1b[34m",
                    "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                    " |                 Premium Articles                |\n" +
                    " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
                let regex = /<h2>[\s\S].*?<\/h2>+/gsi;
                let regex2 = /<h3>[\s\S].*?<\/h3>+/gsi;
                let regex3 = /<h4>[\s\S].*?<\/h4>+/gsi;
                let result = regex.exec(res_data);
                copy2.push(result[0].replace("<h2>", "").replace("</h2>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
                for(let a = 0;a<2;a++) {
                    result = regex2.exec(res_data);
                    //console.log(result[0].replace("<h3>", "").replace("</h3>", "").trim(), regex2.lastIndex);
                    copy2.push(result[0].replace("<h3>", "").replace("</h3>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
                }
                for(let a = 0;a<2;a++) {
                    result = regex3.exec(res_data);
                    copy2.push(result[0].replace("<h4>", "").replace("</h4>", "").replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").trim());
                }
                for(let a = 0;a<10;a++) {
                    result = regex.exec(res_data);
                    copy2.push(result[0].replace("<i class=\"fa fa-play-circle\" aria-hidden=\"true\"></i>","").replace("<h2>", "").replace("</h2>", "").trim());
                }
                copy2.forEach((t)=>{
                    console.log("\x1b[31m",t,"\x1b[0m")
                });

            }catch (e) {
                console.log("failed",e.message);
            }
        }
    );
    //compare cp1 vs cp2 diff
	  console.log("\x1b[34m",
	      "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
	      " |          Premium Found On All Pages             |\n" +
	      " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
	  let article_count = 0;
	  let found_articles = [];
	  copy1.forEach((title)=>{
	      copy2.some((title2)=>{
	        if (title.indexOf(title2.replace("...","").trim())>=0){
	            console.log(title,"\x1b[33m" ,title2 ,"\x1b[32m", ":FOUND","\x1b[0m");
	            article_count++;
	            found_articles.push(title2);
	            return true;
	        }
	      });
	  });
    console.log("\x1b[32m","Spread of Premium Articles Count:", article_count,"\x1b[0m");
    article_count =0;
		console.log("\x1b[34m",
				"+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
				" |      Premium representation On All Pages        |\n" +
				" +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
		copy2.forEach((title)=>{
			found_articles.some((title2)=>{
				if (title.indexOf(title2.replace("...","").trim())>=0){
					console.log(title,"\x1b[33m" ,title2 ,"\x1b[32m", ":FOUND","\x1b[0m");
					article_count++;
					return true;
				}
			});
		});
	console.log("\x1b[32m","Representation:", article_count/copy2.length*100,"%\x1b[0m");
})();
