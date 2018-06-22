const Config = require("./setup");
//case create and read file
try {
    let conf = new Config();
    conf.init("../app.ini");
    //console.log(conf);

    // case add to file and update
    conf.add_to_file("tl","base","http://www.timeslive.co.za");
    conf.add_to_file("st","base","http://select.timeslive.co.za");
    conf.add_to_file("sl","base","http://www.sowetanlive.co.za");
    conf.add_to_file("tl","login","/u/sign-in");
    conf.add_to_file("st","login","/u/sign-in");
    conf.add_to_file("sl","login","/u/sign-in");
    conf.add_to_file("tl","login","/u/sign-in");
    conf.add_to_file("tl","empty","");
    conf.add_to_file("st","empty","");
    conf.add_to_file("sl","empty","");
    conf.add_to_file("bl","empty","");
    conf.add_to_file("tl","name","timeslive");
    conf.add_to_file("st","name","timesselect");
    conf.add_to_file("sl","name","sowetanlive");
    conf.add_to_file("bl","name","businesslive");

    console.log(conf.get_url("tl",'login'));
    
} catch (error) {
    console.log(error);
}


// case read file
// case update file