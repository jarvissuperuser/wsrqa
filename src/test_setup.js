const Config = require("./setup");
//case create and read file
try {
    let conf = new Config();
    conf.init("../app.ini");
    //console.log(conf);

    let pub_arr = ["tl","st","wo","sl","dl","hl","bl"];

    // case add to file and update
    conf.add_to_file("tl","base","http://www.timeslive.co.za");
    conf.add_to_file("st","base","http://select.timeslive.co.za");
    conf.add_to_file("sl","base","http://www.sowetanlive.co.za");
    conf.add_to_file("bl","base","http://www.businesslive.co.za");
    conf.add_to_file("wo","base","http://www.wantedonline.co.za");
    conf.add_to_file("hl","base","http://www.heraldlive.co.za");
    conf.add_to_file("dl","base","http://www.dispatchlive.co.za");
    pub_arr.forEach(el=>conf.add_to_file(el,"path",`./public/images/${el}/`));
    pub_arr.forEach(el=>conf.add_to_file(el,"login","/u/sign-in/"));
    conf.add_to_file("wo","login","");//exclusion
    pub_arr.forEach(el=>conf.add_to_file(el,"empty",""));
    pub_arr.forEach(el=>conf.add_to_file(el,"reset","/u/reset/"));
    conf.add_to_file("wo","reset","");
    pub_arr.forEach(el=>conf.add_to_file(el,"buy","/buy/"));
    conf.add_to_file("wo","buy","");
    conf.add_to_file("sl","buy","");
    conf.add_to_file("dl","buy","");
    conf.add_to_file("hl","buy","");
    conf.add_to_file("tl","name","timeslive");
    conf.add_to_file("st","name","timesselect");
    conf.add_to_file("sl","name","sowetanlive");
    conf.add_to_file("bl","name","businesslive");
    conf.add_to_file("hl","name","heraldlive");
    conf.add_to_file("dl","name","dispatchlive");
    conf.add_to_file("wo","name","wanted");
    conf.add_to_file("bl","name-test","businesslive");

    console.log(conf.get_url("tl",'buy'));
    console.log(conf.get_values("bl",'path'));
    
} catch (error) {
    console.log(error);
}


// case read file
// case update file