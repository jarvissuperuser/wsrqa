const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");
const dev =  require("./devDescExt");

let pm = new PM();
let wPath = ['type'],copy2 = [];
let u = new UJMan();
const p = 'st';
const pub = "times-live";
const query = "in pictures";
//'times-live';//"times-select"
let config = new CFG();
config.init("./app.ini");
// config.get_url(p)
config.env = "live";
let getFromPath=(obj ={},path =[])=>{
    let result = obj;
    path.forEach(e=>{
        if (result&&result.hasOwnProperty(e))
            result = result[e];
    });
    return result;
};
let search = (widgetName)=>{
    let widgets = ["chartblocks",'soundcloud',"giphy","polldaddy","jwplayer","kickstarter","infoblock","infogram",
        "facebook_post",'facebook_video',"gallery","p","facebook_video",'quoe',"instagrm",'tweet',
        'scribed','article_lis','youtub'];
    // let widgets = ['article_list','giphy','issuu',"chartblocks","scribd","kickstarter","crowdsignal"];
    return widgets.some((w)=>{return w===widgetName});
};

let sectionLoop = async (publication) =>{

    for(let section of config.get_values(publication,"sections")) {
        console.log("\tSECTION",section);
        await pm.sendRequest(config.get_url(p) + "/apiv1/workflow/get-all",
            function (r) {
                console.log(Array.isArray(r.resp), "r.resp");
                if (Array.isArray(r.resp)) {
                    console.log("Response is array");
                    r.resp.forEach((article) => {
                        if (Array.isArray(article.article.widgets)) {
                            article.article.widgets.some((w, id) => {
                                let widgetValue = getFromPath(w, wPath);
                                if (search(widgetValue)) {
                                    console.log("\t", article.article.title, config.get_url(p) + article.article.pub_url, article.article.modified_user,id, w.type, article.article.widgets.length);
                                    return true;
                                }
                            });
                        }
                    });
                } else {
                    console.log(r.resp, ">> error");
                }
            }, {
                method: "POST",
                json:
                    {
                        status: "featured",
                        limit: 50,
                        offset: 0,
                        publication: config.get_values(publication, "publication"),
                        section: section
                    }

            });
    }
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
                        article.article.widgets.some((w,id)=>{
                            let widgetValue = getFromPath(w,wPath);
                            if (search(widgetValue)){
                                console.log("\t",article.article.title,config.get_url(p) + article.article.pub_url,id,article.article.modified_user,w.type,article.article.widgets.length);
                                // console.log("\n",article.article.widgets,"\n");
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
                    publication: config.get_values(p,"publication"),
                    section: "home"
                }

        });
    console.log("Query>>e");
    await pm.sendRequest( config.get_url(p)+'/apiv1/pub/articles/get-all?access_token=d2b5fcdb34d9739637444befb469e05e2d49e271',
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array",r.resp.length);
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.widgets)){
                        //console.log(article.title,"\t\tarticle");
                        article.widgets.some((w,id)=>{
                            // console.log("\t\t\t",w.type)
                            let widgetValue = getFromPath(w,['type']);
                            // console.log(w.type);
                            if (search(widgetValue)){
                                console.log("\t",article.title,config.get_url(p) + article.pub_url,article.modified_user,id,w.type,article.widgets.length);
                                // console.log("\n",article.widgets,"\n");
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
                    query: query,
                    limit: 100,
                    offset: 0,
                    access_token: "d2b5fcdb34d9739637444befb469e05e2d49e271",
                    stripped: true
                },

        });
    await sectionLoop(p);

    config.env = "base";
    await pm.sendRequest( config.get_url('sl')+'/apiv1/pub/articles/get-all',
        function (r) {
            console.log(Array.isArray(r.resp), "r.resp");
            if (Array.isArray(r.resp)){
                console.log("Response is array",r.resp.length);
                r.resp.forEach((article)=>{
                    if (Array.isArray(article.widgets)){
                        console.log(article.title,config.get_url('sl')+article.pub_url,"\t\tarticle");
                        article.widgets.some((w)=>{
                            console.log("\t\t\t",w.type)
                            // if (search(w.type)){
                            //
                            //     // console.log("\t",article.title,article.pub_url,article.content_type);pm.expect(article.plain_text === "~");
                            //     // pm.test("API text Not readable for >>" + article.title,function () {
                            //     //     pm.expectGallery(article.plain_text).to.equal('~ No Access ~');
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
                    query: "somizi",
                    limit: 40,
                    offset: 0,
                    // publication: "sowetan-live",
                    // section: "news"
                    stripped: true
                }

        });
})();
