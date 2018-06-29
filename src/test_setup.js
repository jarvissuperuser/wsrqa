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
    conf.add_to_file("bl","base","http://www.businesslive.co.za");
    conf.add_to_file("wo","base","http://www.wantedonline.co.za");
    conf.add_to_file("hl","base","http://www.heraldlive.co.za");
    conf.add_to_file("dl","base","http://www.dispatchlive.co.za");
    conf.add_to_file("tl","login","/u/sign-in/");
    conf.add_to_file("st","login","/u/sign-in/");
    conf.add_to_file("sl","login","/u/sign-in/");
    conf.add_to_file("tl","login","/u/sign-in/");
    conf.add_to_file("bl","login","/u/sign-in/");
    conf.add_to_file("wo","login","/u/sign-in/");
    conf.add_to_file("hl","login","/u/sign-in/");
    conf.add_to_file("dl","login","/u/sign-in/");
    conf.add_to_file("tl","empty","");
    conf.add_to_file("st","empty","");
    conf.add_to_file("sl","empty","");
    conf.add_to_file("bl","empty","");
    conf.add_to_file("wo","empty","");
    conf.add_to_file("hl","empty","");
    conf.add_to_file("dl","empty","");
    conf.add_to_file("tl","name","timeslive");
    conf.add_to_file("st","name","timesselect");
    conf.add_to_file("sl","name","sowetanlive");
    conf.add_to_file("bl","name","businesslive");
    conf.add_to_file("hl","name","heraldlive");
    conf.add_to_file("dl","name","dispatchlive");
    conf.add_to_file("wanted","name","wanted");
    conf.add_to_file("bl","name-test","businesslive");

    console.log(conf.get_url("tl",'login'));
    
} catch (error) {
    console.log(error);
}


// case read file
// case update file