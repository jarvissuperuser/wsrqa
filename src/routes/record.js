/**
 * compatible with new version of SQLite_con_man
 * */
let express = require('express');
let router = express.Router();
let dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
 let dbo = new dbl("../app.db");
let arr = {};
let rsa = [];
let testCases = [/timeslive+/g,/businesslive+/g,/wanted+/g,/sowetanlive+/g,/heraldlive+/g,
	/tl_home+/g,/bl_home/g,/w_home+/g,/sl_home+/g,/hl_home+/g];
let resset = ["tl_home","bl_home","w_home","sl_home","hl_home","tl_article"];
let projectNames = ["timeslive","businesslive","wanted","sowetanlive","heraldlive","test"];
let dirPath = "";
let prName = "";
/** helper functions */
let get_project = (image) =>{
	let x = 0;
	testCases.forEach((rgx)=>{
		if (rgx.test(image)){
			dirPath = resset[x%5];
			prName = projectNames[x%5];
			console.log('testCase',x,rgx.test(image),dirPath);
		}
		x=x+1;
	});
};
/** deprecated 

let get_project = (image)=>{
	let sp = image.split('_');
	if (sp.length>1)
		return sp[0]+"_"+sp[1];
	else 
		return undefined;
};*/
/**
 *  GET record page.
 *  TODO: test query variable check if is integer,
 *  TODO: extra functions to a new middleware
 *  */
router.get('/', function(req, rest, next) {
		dbo.db.all("select * from log_info where t_id ="+ req.query.test, (err, rows) => {
        rows.forEach(row => {
						arr = {};
						get_project(row.log_image);
            arr['image'] =row.log_image;
						arr['info']=row.log_info;
						arr['project']= dirPath;
						rsa.push(arr);
        });
        arr = {};
        arr['img'] = `${prName}.png`;
        arr['path'] = `${dirPath}`;
        rest.render('record', { title: 'Regression for '+req.query.test , asts: rsa, base:arr });
				rsa = [];
				prName = "";
				dirPath ="";
    });
		//rest.render('record',
		//{title:'Test Results', 
		//res:['data','in','this','form']});
		
});

module.exports = router;
