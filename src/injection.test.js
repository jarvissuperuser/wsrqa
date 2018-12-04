const injectionmiddleware = require("./middleware/injectionengine");



(async function main() {
/**
 * Mock input
 * */
await injectionmiddleware("*","*","no");
})();