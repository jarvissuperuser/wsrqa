const tf = require("./textFind");
const CFG = require("./setup");
const PM = require("./post_mn");

let config = new CFG();
let pm = new PM();



(async function main(){
    await pm.test("textFile loose test true",async function () {
        let result = await tf("'Hel'lo' World!","HELlo", "Loose");
        await pm.expect(result).to.equal(true);
    });
    await pm.test("textFile &  loose test true ",async function () {
        let result = await tf("'Hel'lo' &amp; World!"," & ", "Loose");
        await pm.expect(result).to.equal(true);
    });
    await pm.test("textFile & loose test true",async function (t) {
        let result = await tf("'Hel'lo' &AMP; World!"," & ", "Loose");
        await pm.expect(result).to.equal(true);
    });
})();