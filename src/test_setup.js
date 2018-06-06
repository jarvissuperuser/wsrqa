const Config = require("./setup");
//case create and read file
try {
    let conf = new Config();
    conf.init("../app.ini");
    //console.log(conf);

    // case add to file and update
    conf.add_to_file("tl","base","http://www.timeslive.co.za");
    conf.add_to_file("st","base","http://select.timeslive.co.za");
    conf.add_to_file("tl","login","/u/sign-in");
    conf.add_to_file("tl","empty","");

    console.log(conf.get_url("tl",'login'));
    
} catch (error) {
    console.log(error);
}


// case read file
// case update file