const UJMan = require("./userjourney");
const PM = require("./post_mn");
const CFG = require("./setup");
const textFind = require("./textFind");
const moment =  require("moment");

let pm = new PM();
let copy1 = [],copy2 = [];
let u = new UJMan();
const p = "bl";
let config = new CFG();
config.init("./app.ini");

(async function main() {
    await pm.sendRequest("https://www.businesslive.co.za/apiv1/nova/data/search-image",
        function (r) {
    	    if(Array.isArray(r)){
    	    	console.log("Length: ",r.length);
    	    	r.forEach((e,i)=>{console.log("Data",i,">>",e)});
	        }
        },
        {
            method:"POST",
            json:
                {
                    "feed":"",
                    "query":"",
                    "limit":50,
                    "offset":0,
                    "/apiv1/nova/data/search-image":""
                }
        });
    await pm.test("test",function () {

    })
})();