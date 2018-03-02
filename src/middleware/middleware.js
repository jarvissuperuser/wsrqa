var webshot = require("webshot");
var moment = require("moment");
var resemble = require("node-resemble-js");
var fs = require('fs-extra');
//var amqp = require('amqplib');
var amqp = require('amqp-connection-manager');
var async = require("async");

const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
const modbileAgent = '';
let project = '';
let isMobile = '';
let runTests = '';
let testImg = '';
let pivotImg = '';
let fileName = '';
let QueueName = '';
var filesExist;
var channelWrapper;
var timestamp;
var connection = amqp.connect(['amqp://admin:root1234@localhost:5672']) ;//guest only when client is local on server host

var options = {
	screenSize : {
		width : 1920,
		height : 1080
  },
	shotSize : {
		width : "all",
		height : "all"
	},
	userAgent : desktopAgent
};

var testurls = {
	"tl_home" : "www.timeslive.co.za",
	"tl_article" : "www.timeslive.co.za/politics/2018-01-18-ramaphosa-piles-pressure-on-zuma-with-anti-corruption-call" ,
	"bl_home" : "www.businesslive.co.za",
	"sl_home" : "www.sowetanlive.co.za" ,
	"w_home" : "wantedonline.co.za"
};
var projects={
	"tl_home":"timeslive",
	"tl_article":"timeslive",
	"bl_live":"businesslive",
	"sl_home":"sowetanlive",
	"w_home":"wanted"
};

var testLocations;

const runDiff  = (name,timestamp) => {

	try{
	//  channelWrapper.sendToQueue(QueueName, {diff: 'running diff on_' + name})
		if(filesExist.pivot&&filesExist.test)
		resemble(pivotImg)
		.compareTo(testImg).ignoreNothing().onComplete(function(data){
			if (data.misMatchPercentage > 5){
				console.log("name:" + name + ",datafailed:true",'./public/images/' + project + '/' + name + '_' + timestamp + '_diff.png');
				channelWrapper.publish(QueueName,"diff",new Buffer('diff: Test Failed on_' + extractFile(testImg) + 'See diff image'));
				//channelWrapper.sendToQueue(QueueName, {failed: data})
				data.getDiffImage().pack().pipe(fs.
				createWriteStream('./public/images/' + project + '/' + name + '_' + timestamp + '_diff.png'));
			}else{
				channelWrapper.publish(QueueName,'diff',new Buffer('Test Passed on_' + extractImg(testImg)+ '_Hoory Have some beers'));
				//channelWrapper.sendToQueue(QueueName, {passed: data})
				console.log("name:"+name+",datafailed:false");
			}

		});
		else
			throw ("runnDiff error");
	}catch(ex){
		console.log(ex,"no file found");
	}
};

var runDiffP = (resolve,reject)=>{
	if(filesExist.pivot&&filesExist.test)
	resemble(pivotImg)
	.compareTo(testImg).ignoreNothing().onComplete(function(data){
		if (data.misMatchPercentage > 5){
			console.log("name:" + project + ",datafailed:true")
			channelWrapper.publish(QueueName, "diff" ,new Buffer('diff: Test Failed on_' + extractFile(testImg)+ 'See diff image'));
			//channelWrapper.sendToQueue(QueueName, new Buffer("dataFailed"));
			data.getDiffImage().pack().pipe(fs.
			createWriteStream('./public/images/' + project + '/' + project + '_' +
			timestamp + '_diff.png'));
			resolve();
		}else{
			channelWrapper.publish(QueueName, {diff: 'Test Passed on_' + extractFile(testImg)+ '_Hoory Have some beers'});
			channelWrapper.publish(QueueName,'null' ,new Buffer( btoa(data)));
			console.log("name:"+project+",datafailed:false,",QueueName);
			reject();
		}

	});
	else
		console.log("runnDiff error");
}

const checkFiles= () => {
	let parentDir = getParentDir(fileName);
	fs.readdir(parentDir,(err,files)=>{
			if (!err){
				console.log("listing files");
				files.forEach(file=>{
					if (file === extractFile(pivotImg)){
						filesExist["pivot"] = true;
					}
					if (file === extractFile(testImg)){
						filesExist["pivot"] = true;
					}
					console.log(file);
				});
				console.log(filesExist.pivot,extractFile(pivotImg),"list file .done");
			}
			else{
				fs.emptyDir('./public/images/' + project + '/', err => {
					if (err){
						//channelWrapper.sendToQueue(QueueName, {fail: 'failed to delete images'})
						console.log("files error",err);
						process.exit('0');
					}
					console.log(err,"here");
				});
			}
		});
}

var checkFilesP = (resolve,reject)=>{
	let parentDir = getParentDir(fileName);
	fs.readdir(parentDir,(err,files)=>{
			if (!err){
				console.log("listing files");
				files.forEach(file=>{
					if (file === extractFile(pivotImg)){
						filesExist["pivot"] = true;
					}
					if (file === extractFile(testImg)){
						filesExist["test"] = true;
					}
				});
				console.log(filesExist,extractFile(filesExist.test?testImg:pivotImg),
					"list file .done");
				channelWrapper.publish(QueueName,"msg", new Buffer('fail: failed to create dir'));
				resolve();
			}
			else{
				fs.emptyDir('./public/images/' + project + '/', err => {
					if (err){
						channelWrapper.dir(QueueName,'fail',new Buffer( 'failed to create dir'));
						console.log("files error",err);
						reject(process.exit('0'));
					}
					console.log("Creating Project here", err);
					resolve();
				});


			}
		});
}
const getScreens = ()=> {

//    channelWrapper.sendToQueue(QueueName, {screens: 'geting screen_' + name})
	fileName = (filesExist.pivot) ? './public/images/' + project + '/' + name + '_' + timestamp + '.png' : './public/images/' + project + '/' + name + '.png' ;

	try {
		console.log(fileName, "attempt for image");
		webshot(testLocations, fileName, options, function(err) {
			console.log("test err");
			//await checkFiles();
			///if (err) throw err.message;
			if (true){
				//channelWrapper.sendToQueue(QueueName, {screens: 'running test screen for_' + name})
				console.log("img error or rundiff");
				if (err)
					console.log(err);
				//else if (filesExist.pivot&&filesExist.test)
		    	//runDiff(name,timestamp);
				//          channelWrapper.sendToQueue(QueueName, {screens: 'building test screen for_' + name})
				console.log("Building test cases");
				//res.write("yes:"+err.message);
			}
		});
	}catch(ex){
		console.log("exception getscreen",ex);
	}
};
var getScreensP = (resolve,reject) => {
	fileName = (filesExist.pivot) ? 
	'./public/images/' + project + '/' + name + '_' + timestamp + '.png' : './public/images/' + project + '/' + name + '.png' ;

	try {
		console.log(fileName, "attempt for image");
		webshot(testLocations, fileName, options, function(err) {
			//console.log("test err");
			//await checkFiles();
			///if (err) throw err.message;

			//if (true){
			channelWrapper.sendToQueue(QueueName, new Buffer( 'screens:running test screen for_' ));
			console.log("img error or rundiff");
			if (err){
				console.log(err);
				reject(err);
			}
				//else if (filesExist.pivot&&filesExist.test)
		    	//runDiff(name,timestamp);
			channelWrapper.publish(QueueName, "screens",new Buffer('screens:building test screen for_' + name))
			.then(function(){
				console.log("rabbit done")
			})
			.catch(function(end){
				console.log(end);
			});
			console.log("Building test cases",QueueName);
			resolve()
				//res.write("yes:"+err.message);
			//}
		});
	}catch(ex){
		console.log("exception getscreen",ex);
	}
}

var arrayToPath = (arr) => {
	return arr.join('/');
}
var getParentDir = (path) =>{
	try{
		var splitPath = path.split('/');// only for unix/unix-like
		//splitPath.reverse();
		//console.log(splitPath);
		splitPath.pop();
		//console.log(splitPath);
		//splitPath.reverse();
		//console.log(splitPath);
		return  arrayToPath(splitPath);
	}catch(ex){
		console.log(ex);
	}

};
var extractFile= (filePath) =>{
	var arr = filePath.split("/"); //unix/unix-like
	//console.log(arr,filePath,"extractFile");
	arr.reverse();
	return arr[0];
};

module.exports = async(p,m,t) => {

	project = p;
	isMobile = m;
	runTests = t;

	timestamp = moment().format("MM-D-YY-h-mm-s");
	console.log("Loading Tests app at " + timestamp);
	QueueName = "t_" + timestamp;
	name= (projects[p]===undefined)?project:projects[p];
	testImg = './public/images/' + project + '/' + name + '_' + timestamp + '.png';
	pivotImg = './public/images/' + project + '/' + name + '.png' ;
	fileName = (runTests === 'yes') ? testImg: pivotImg ;
	filesExist = {test:false,pivot:false};
	//preconfig = paths
	//checkFiles();
	channelWrapper = connection.createChannel({
          json: true,
          setup: function(channel) {

              return channel.assertExchange(project,"direct" ,{durable: true});
          }
  });
	//channelWrapper.addSetup(function(channel){
	//	Promise.all([
	//		channel.assertQueue(QueueName,project,"diff")
	//	]);
	//});
	//console.log("working on err")
	//if(runTests !== "yes"){
		//fs.emptyDir('./public/images/' + project + '/', err => {
			//if (err){
				//       channelWrapper.sendToQueue(QueueName, {fail: 'failed to delete images'})
		//	}
			//console.log(err,"here");
		//});
	//}
	testLocations = testurls[project];

//        for(let page in testLocations){
//        getScreens(page,testLocations[page]);
//		console.log(testLocation[page],page);
	//        }

	//var arrCBs = [];
	var pr = new Promise(checkFilesP);
	pr.then(()=>{
		return new Promise(getScreensP);
	}).then((gsp)=>{
		return new Promise(checkFilesP);
	}).then((f)=>{
		if (filesExist.test)
			runDiff(name,timestamp);
		else 
			console.log("nothing to test':'diff avoided");
	}).catch((ex)=>{
		console.error(ex,"app error");
	});
	/*async.waterfall([
		await checkFiles();
		await getScreens();
		await checkFiles();
		await runDiff(name,timestamp);*/
	//],
//	function(err){console.log(err);});


	//getScreens(project,testLocations);
	//console.log(testLocations,testurls);
};

