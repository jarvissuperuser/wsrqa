const sub = require("./Subscriptions");
const PM = require("./post_mn");

const pm = new PM();
(async function main(){
    // console.log("Test Subscriptions");
    let result = await sub({email: "water", actions: "get-search-widget", path: "hr,youtube", password: "", pub: "tl"});
    await pm.test("Test: Search Widget result is array?",async function() {
        await pm.expect(Array.isArray(result)).to.equal(true);
    });
    await pm.test("Test: Result set has strings ",async function() {
        await pm.expect(typeof result[0]).to.equal("string");
    });
    result = await sub({email: "mugadzatt01@gmail.com", actions: "get-subs", path: "codes,length", password: "Ttm331371", pub: "tl"});
    await pm.test("Test: User Result has access data?",async function() {
        //console.log(result);
        await pm.expect(Array.isArray(result)).to.equal(true);
    });

})();
