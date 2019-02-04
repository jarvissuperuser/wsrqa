const injectionmiddleware = require("./middleware/injectionengine");
const CFG = require("./setup");

let setup = new CFG();

(async function main() {
 /**
 * Mock input
 * */
 setup.init("./app.ini");
 let res = await injectionmiddleware("*","*","no","Galaxy S5");
 console.log(JSON.stringify(res));
})();