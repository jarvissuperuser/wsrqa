const tf = require("./textFind");
const CFG = require("./setup");
const PM = require("./post_mn");

let config = new CFG();
let pm = new PM();



(async function main(){
    await pm.test("textFile loose test true",async function (t) {
        let result = tf("'Hel'lo' World!","HELlo", "Loose");
        await pm.expect(result).to.equal(true);
    })
})();