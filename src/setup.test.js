const Config = require("./setup");
//case create and read file
try {
    let conf = new Config();
    conf.init("./app.ini");
    let obj = conf.setup.empty;
    for(let o in obj){
        console.log(o);
    }
} catch (e) {
    console.log("\x1b[31m",e.message,"\x1b[0m");
}