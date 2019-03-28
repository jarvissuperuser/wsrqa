const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");
const dev =  require("./devDescExt");

let pm = new PM();
let wPath = ['type'],copy2 = [];
let u = new UJMan();
const p = 'bl';
const pub = 'bl';
let config = new CFG();
config.init("./app.ini");
// config.get_url(p)
config.env = "live";
let getFromPath=(obj ={},path =[])=>{
    let result = obj;
    path.forEach(e=>{
        if (result.hasOwnProperty(e))
            result = result[e];
    });
    return result;
};
let search = (widgetName)=>{
    // let widgets = ["iono","gallery","jwplayer","polldaddy","facebook_video","youtube","tweet",'instagram',"quote"];
    let widgets = ['image','iono','gallery','instagram','tweet'];
    return widgets.some((w)=>{return w===widgetName});
};


(async function main() {
    console.log("Home URL >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.article.widgets)){
                        article.article.widgets.some((w)=>{
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue)){
                                console.log("\t",article.article.title,config.get_url(p) + article.article.pub_url,w.type);
                                // console.log("\n",w,"\n");
                                return true;
                            }
                        });
                    }
                    // if (article.article.external_url){
                    //     console.log("external_url",article.article.title);
                    // }
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
                    publication: pub,
                    section: "home"
                }

        });


    await pm.sendRequest( config.get_url(p)+'/apiv1/pub/articles/get-all',
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array",r.resp.length);
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.widgets)){
                        //console.log(article.title,"\t\tarticle");
                        article.widgets.some((w)=>{
                            // console.log("\t\t\t",w.type)
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue)){
                                console.log("\t",article.title,config.get_url(p) + article.pub_url,w.type);
                                // console.log("\n",w,"\n");
                                return true;
                            }
                            // if (search(w.type)){
                            //
                            //     // console.log("\t",article.title,article.pub_url,article.content_type);pm.expect(article.plain_text === "~");
                            //     // pm.test("API text Not readable for >>" + article.title,function () {
                            //     //     pm.expect(article.plain_text).to.equal('~ No Access ~');
                            //     // });
                            //     // if(article.title === "Auryo Open Source Streaming Player"){
                            //     //     console.log("\n\n\n",article.intro," \n\n\n\n");
                            //     //     // console.log()
                            //     // }
                            //
                            //     return true;
                            // }
                        });

                    }
                });
            }else{
                console.log(r.resp,r,'>>Error 2');
            }
        },{
            method : "POST",
            json:
                {
                    status: "published,draft",
                    query: "a",
                    limit: 100,
                    offset: 0,
                    // publication: "sowetan-live",
                    // section: "news"
                    stripped: true
                },

        });

    console.log("News >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.article.widgets)){
                        article.article.widgets.some((w)=>{
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue) ){
                                console.log("\t",article.article.title,config.get_url(p) + article.article.pub_url,w.type);
                                return true;
                            }
                        });
                    }
                });
            }else{
                console.log(r.resp,r,'>>Error 2');
            }
        },{
        method : "POST",
            json:
                {
                    status: "featured",
                    limit: 24,
                    offset: 0,
                    publication: pub,
                    section: "news"
                }

        });

    console.log("Markets URL >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach(({article})=>{
                    if (Array.isArray(article.widgets)){

                        article.widgets.some((w)=>{
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue)){
                                console.log("\t",article.title,config.get_url(p) + article.pub_url,w.type);
                                // console.log("\n",w,"\n");
                                return true;
                            }
                        });
                    }
                    // if (article.article.external_url){
                    //     console.log("external_url",article.article.title);
                    // }
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
                    publication: pub,
                    section: "markets"
                }

        });
    console.log("Opinions URL >>");
    await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array");
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.article.widgets)){
                        article.article.widgets.some((w)=>{
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue)){
                                console.log("\t",article.article.title,config.get_url(p) + article.article.pub_url,w.type);
                                return true;
                            }
                        });
                    }
                    // if (article.article.external_url){
                    //     console.log("external_url",article.article.title);
                    // }
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
                    publication: pub,
                    section: "opinion"
                }

        });
    config.env = "base";
    // await pm.sendRequest( config.get_url('sl')+'/apiv1/pub/articles/get-all',
    //     function (r) {
    //         console.log(Array.isArray(r.resp), "r.resp");
    //         if (Array.isArray(r.resp)){
    //             console.log("Response is array",r.resp.length);
    //             r.resp.forEach((article)=>{
    //                 if (Array.isArray(article.widgets)){
    //                     console.log(article.title,"\t\tarticle");
    //                     article.widgets.some((w)=>{
    //                         console.log("\t\t\t",w.type)
    //                         // if (search(w.type)){
    //                         //
    //                         //     // console.log("\t",article.title,article.pub_url,article.content_type);pm.expect(article.plain_text === "~");
    //                         //     // pm.test("API text Not readable for >>" + article.title,function () {
    //                         //     //     pm.expect(article.plain_text).to.equal('~ No Access ~');
    //                         //     // });
    //                         //     // if(article.title === "Auryo Open Source Streaming Player"){
    //                         //     //     console.log("\n\n\n",article.intro," \n\n\n\n");
    //                         //     //     // console.log()
    //                         //     // }
    //                         //
    //                         //     return true;
    //                         // }
    //                     });
    //
    //                 }
    //             });
    //         }else{
    //             console.log(r.resp,r,'>>Error 2');
    //         }
    //     },{
    //         method : "POST",
    //         json:
    //             {
    //                 status: "published,draft",
    //                 query: "somizi",
    //                 limit: 40,
    //                 offset: 0,
    //                 // publication: "sowetan-live",
    //                 // section: "news"
    //                 stripped: true
    //             }
    //
    //     });
})();