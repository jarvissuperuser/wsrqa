const injectionmiddleware = require("./middleware/injectionengine");



(async function main() {
/**
 * Mock input
 * */
let res = await injectionmiddleware("*","*","no");
 console.log(JSON.stringify(res));
})();