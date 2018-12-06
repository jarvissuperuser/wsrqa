const injectionmiddleware = require("./middleware/injectionengine");
const CFG = require("./setup");

let setup = new CFG();

(async function main() {
 /**
 * Mock input
 * */
 setup.init("./app.ini");
 let res = await injectionmiddleware("st","crosswords","no");
 console.log(JSON.stringify(res));
})();