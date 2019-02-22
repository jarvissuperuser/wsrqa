const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");
const dev =  require("./devDescExt");

let pm = new PM();
let copy1 = [],copy2 = [];
let u = new UJMan();
const p = "tl";
let config = new CFG();
config.init("./app.ini");
//?access_token=3f1cf4105e806a42f6ca789273c9c6b190dfcdbb"

let timeConvert = (timeStamp )=>{
    let a = new Date(timeStamp);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
};

let mrfSectionArticle = async(section)=>{
    let url = section?config.get_section(p,section):config.get_url(p);
    await u.page.waitFor(2000);
    await u.page.goto(url);
    await u.page.reload();
    await u.page.waitFor(2000);
    //await u.page.screenshot({path:`mrf_${section}_${u.timestamp}.png`,fullPage:true});
    return await u.page.evaluate(()=>
        Array.from(document.querySelectorAll('.mrf-article__title'),
                element=>
                    element.innerText));
};

let comparator = (title ,mList = [])=>{
    return mList.some(article =>{return textFind(title,article,"l")});
};

( async function main() {
    await u.initBrowser('Galaxy S5'); //initialise browser emulating Galaxy S5
    //await u.page.goto();
    const context = await u.browser.createIncognitoBrowserContext();
    u.page = await context.newPage();
    await u.page.emulate(dev["Galaxy S5"]);
    console.log(moment());
    let articleList = await mrfSectionArticle('').catch(e=>console.log("\x1b[31m\n",e.message,"\x1b[0m"));
    await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/workflow/get-all", function (response) {
            const res_data = (response.resp);
            console.log("\x1b[34m\n",
                "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                " |       HOME Page: Articles & Content Info        |\n" +
                " +++++++++++++++++++++++++++++++++++++++++++++++++++", "\x1b[0m");
            try {

                res_data.forEach((r) => {
                    console.log("\x1b[31m", r.article.title,
                        `\x1b[0m ; ${r.article.pub_url} ; ${r.article.sections[0].publication} ; \x1b[33m`,
                        timeConvert(r.article.published),
                        `\x1b[0m ; ${comparator(r.article.title,articleList)?"Found":"Not Found"} `);
                    copy1.push(r.article);
                });
            } catch (e) {
                console.log(res_data);
            }
        console.log("\x1b[32m\n",
            "+++++++++++++++++++++++++++++++++++++++++++++++++++\n", "\x1b[0m");
        }, {
            method: "POST",
            json:
                {
                    status: "featured",
                    limit: 50,
                    offset: 0,
                    publication: "times-live",
                    section: "home"
                }
        }

    );
    if (Array.isArray(articleList)){
        articleList.forEach((article,i)=>{
            console.log(`${article} ; ${i}`);
        });
    }

    //NEWS articles
    articleList = await mrfSectionArticle('news').catch(e=>console.log("\x1b[31m\n",e.message,"\x1b[0m"));
    await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/workflow/get-all", function (response) {
            const res_data = (response.resp);
            console.log("\x1b[34m\n",
                "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                " |       NEWS Page: Articles & Content Info        |\n" +
                " +++++++++++++++++++++++++++++++++++++++++++++++++++", "\x1b[0m");
            try {
                res_data.forEach((r) => {
                    console.log("\x1b[31m", r.article.title,
                        `\x1b[0m ; ${r.article.pub_url} ; ${r.article.sections[0].publication} ; \x1b[33m`,
                        timeConvert(r.article.published),
                        `\x1b[0m ; ${comparator(r.article.title,articleList)?"Found":"Not Found"} `);
                    copy1.push(r.article);
                });
            } catch (e) {
                console.log(res_data);
            }
        }, {
            method: "POST",
            json:
                {
                    status: "featured",
                    limit: 25,
                    offset: 0,
                    publication: "times-live",
                    section: "news"
                }
        }
    );

    if (Array.isArray(articleList)){
        articleList.forEach((article,i)=>{
            console.log(`${article} ; ${i}`);
        });
    }

    //Politics articles
    articleList = await mrfSectionArticle('politics').catch(e=>console.log("\x1b[31m\n",e.message,"\x1b[0m"));

    await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/workflow/get-all", function (response) {
            const res_data = (response.resp);
            console.log("\x1b[34m\n",
                "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                " |       POLI Page: Articles & Content Info        |\n" +
                " +++++++++++++++++++++++++++++++++++++++++++++++++++", "\x1b[0m");
            try {
                res_data.forEach((r) => {
                    console.log("\x1b[31m", r.article.title,
                        `\x1b[0m ; ${r.article.pub_url} ; ${r.article.sections[0].publication} ; \x1b[33m`,
                        timeConvert(r.article.published),
                        `\x1b[0m ; ${comparator(r.article.title,articleList)?"Found":"Not Found"} `);
                    copy1.push(r.article);
                });
            } catch (e) {
                console.log(res_data);
            }
        }, {
            method: "POST",
            json:
                {
                    status: "featured",
                    limit: 25,
                    offset: 0,
                    publication: "times-live",
                    section: "politics"
                }
        }
    );
    if (Array.isArray(articleList)){
        articleList.forEach((article,i)=>{
            console.log(`${article} ; ${i}`);
        });
    }
    //Sport
    articleList = await mrfSectionArticle('sport').catch(e=>console.log("\x1b[31m\n",e.message,"\x1b[0m"));
    await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/workflow/get-all", function (response) {
            const res_data = (response.resp);
            console.log("\x1b[34m\n",
                "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                " |       SPORT Page: Article & Content Info        |\n" +
                " +++++++++++++++++++++++++++++++++++++++++++++++++++", "\x1b[0m");
            try {
                res_data.forEach((r) => {
                    console.log("\x1b[31m", r.article.title,
                        `\x1b[0m ; ${r.article.pub_url} ; ${r.article.sections[0].publication} ; \x1b[33m`,
                        timeConvert(r.article.published),
                        `\x1b[0m ; ${comparator(r.article.title,articleList)?"Found":"Not Found"} `);
                    copy1.push(r.article);
                });
            } catch (e) {
                console.log(res_data);
            }
        }, {
            method: "POST",
            json:
                {
                    status: "featured",
                    limit: 25,
                    offset: 0,
                    publication: "times-live",
                    section: "sport"
                }
        }
    );
    if (Array.isArray(articleList)){
        articleList.forEach((article,i)=>{
            console.log(`${article} ; ${i}`);
        });
    }
    await u.closeBrowser();
})();