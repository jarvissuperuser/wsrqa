var ws = require("webshot");
var f =  require("fs");

var options= {
	screenSize:{
		width:1920,
		height:1080
	},
	shotSize:{
		width:1920,
		height:1080},
	useragent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
	}
try{	
var w = ws("google.com","test.jpg",function(error){
	
});	
//var s = fs.createWriteStream("file:///home/timothy/softcode/pgNode/testApp/src/data.png",{encoding:"binary"});
//w.on("data",function(d){
	//console.log(d.toString());
	//s.write(d.toString("binary"),"binary");
//});
}catch(ex){
	console.log(ex);
}

//,'./res_test_tLive.png',options,function(err){
//	if (err){
//		console.log(err);
//	}else{
//		console.log("all good");
//	}
//});

module.export = w;
