const Config = require("./setup");
//case create and read file
try {
    let conf = new Config();
    conf.init("./app.ini");
    let pub_arr = ["tl","st","wo","sl","dl","hl","bl"];

    // case add to file and update
    conf.add_to_file("tl","base","http://tl-st-staging.appspot.com");
    conf.add_to_file("st","base","http://timesselect-stage.appspot.com");
    conf.add_to_file("sl","base","http://sowetan-staging.appspot.com");
    conf.add_to_file("bl","base","http://cosmos-stage-qa.appspot.com");
    conf.add_to_file("wo","base","http://wanted-staging.appspot.com");
    conf.add_to_file("hl","base","https://heraldlive.appspot.com");
    conf.add_to_file("dl","base","http://dispatchlive-1357.appspot.com");
    // case env
    conf.add_to_file("tl","live","https://www.timeslive.co.za");
    conf.add_to_file("st","live","https://select.timeslive.co.za");
	conf.add_to_file("sl","live","https://www.sowetanlive.co.za");
	conf.add_to_file("bl","live","https://www.businesslive.co.za");
	conf.add_to_file("wo","live","https://www.wantedonline.co.za");
	conf.add_to_file("hl","live","https://www.heraldlive.co.za");
	conf.add_to_file("dl","live","https://www.dispatchlive.co.za");
	//paths
    pub_arr.forEach(el=>conf.add_to_file(el,"path",`./public/images/${el}/`));
    //login
    pub_arr.forEach(el=>conf.add_to_file(el,"login","/u/sign-in/"));
    conf.add_to_file("wo","login","");//exclusion
    //empty
    pub_arr.forEach(el=>conf.add_to_file(el,"empty",""));
    //reset password
    pub_arr.forEach(el=>conf.add_to_file(el,"reset","/u/reset/"));
    conf.add_to_file("wo","reset","");
    //pay walls
    pub_arr.forEach(el=>conf.add_to_file(el,"buy","/buy/"));
    conf.add_to_file("wo","buy","");
    conf.add_to_file("sl","buy","");
    //conf.add_to_file("hl","buy","");
    //project names
    conf.add_to_file("tl","name","timeslive");
    conf.add_to_file("st","name","timesselect");
    conf.add_to_file("sl","name","sowetanlive");
    conf.add_to_file("bl","name","businesslive");
    conf.add_to_file("hl","name","heraldlive");
    conf.add_to_file("dl","name","dispatchlive");
    conf.add_to_file("wo","name","wanted");
    conf.add_to_file("bl","name-test","businesslive");
    // special articles, crosswords
	pub_arr.forEach(el=>conf.add_to_file(el,"crosswords",""));
	conf.add_to_file('st','crosswords',
		[
			"/lifestyle/2018-09-25-todays-cryptic-crossword/",
			"/lifestyle/2018-06-07-todays-quick-crossword/"
		]);
    //publications sections
	conf.add_to_file("bl","name-test","businesslive");
    conf.add_to_file("tl","sections",
        ["news","politics","sport","tshisalive","lifestyle", "motoring","multimedia"]);
    conf.add_to_file("bl","sections",
        ["markets","opinion","news","politics","companies","economy","people","investing",
            "e-edition"]);
    conf.add_to_file("sl","sections",
        ["news","sport","entertainment","good-life","sebenzalive","opinion","s-mag",
            "business","video"]);
    conf.add_to_file("dl","sections",
        ["news","politics","videos","lifestyle","sport","local-heroes","classifieds",
            "premium"]);
    conf.add_to_file("wo","sections",
        ["style","gift-guide","watches-and-jewellery","cars-bikes-boats","art-design","travel","tech",
            "voices","navigator"]);
    conf.add_to_file("sl","sportlive",
            {
                "football":["psl","epl","uefa","fa","mtn8","nedbankcup","efl","tko"],
                "rugby":[],
                "cricket":[]
            });
    console.log(conf.get_url("tl",'login'));
    conf.env = "live";
    console.log(conf.get_section_list("bl"));

} catch (error) {
    console.log(error);
}


// case read file
// case update file