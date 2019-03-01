const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");
const dev =  require("./devDescExt");

let pm = new PM();
let copy1 = [],copy2 = [];
let u = new UJMan();
const p = "bl";
let config = new CFG();
config.init("./app.ini");
config.env = "live";

let search = (widgetName)=>{
    let widgets = ["tweet"];
    return widgets.some((w)=>{return w===widgetName});
};


(async function main() {
    console.log("News >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.article.widgets)){
                        article.article.widgets.some((w)=>{
                            if (search(w.type) ){
                                console.log("\t",article.article.title,article.article.pub_url,w.type);
                                return true;
                            }
                        });
                    }
                });
            }
        },{
        method : "POST",
            json:
                {
                    status: "featured",
                    limit: 2,
                    offset: 0,
                    publication: "times-live",
                    section: "news"
                }

        });
    console.log("Home External URL >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach((article)=>{
                    // if (Array.isArray(article.article.widgets)){
                    //     article.article.widgets.some((w)=>{
                    //         if (search(w.type)){
                    //             console.log("\t",article.article.title,w.type);
                    //             return true;
                    //         }
                    //     });
                    // }
                    if (article.article.external_url){
                        console.log("external_url",article.article.title);
                    }
                });
            }else {
                console.log(r.resp,">> error");
            }
        },{
            method : "POST",
            json:
                {
                    status: "featured",
                    limit: 50,
                    offset: 0,
                    publication: "bd",
                    section: "home"
                }

        });
})();