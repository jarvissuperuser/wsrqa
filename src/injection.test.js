const injectionmiddleware = require("./middleware/injectionengine");
const CFG = require("./setup");

let setup = new CFG();

(async function main() {
 /**
 * Mock input
 * */
 let res = await injectionmiddleware("st","*","no");
 console.log(JSON.stringify(res));
})();
