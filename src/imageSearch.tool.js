/***
 * @summary A image to test GN4 fetching of images
 */


const PM = require("./post_mn");
const CFG = require("./setup");

let pm = new PM();
let copy1 = [],copy2 = [];
const p = "bl";
let config = new CFG();
config.init("./app.ini");

(async function main() {
    await pm.sendRequest(config.get_url(p)+"/apiv1/nova/data/search-image",
        function (r) {
    	    if(Array.isArray(r.resp)){
    	    	console.log("Length: ",r.resp.length);
    	    	let space = " ";
    	    	r.resp.forEach((e,i)=>{console.log("Data",i,">>",`Title:${e.n_data.title},Auth:${e.n_data.author},Description:${e.n_data.description},S:${space}.`)});
	        }
	        else
	        console.log(r);
        },
        {
            method:"POST",
            json:
                {
                    "feed":"",
                    "query":"",
                    "limit":20,
                    "offset":0,
                    "/apiv1/nova/data/search-image":""
                }
        });
    await pm.test("test",function () {

    })
})();