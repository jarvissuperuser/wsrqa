//import { O_WRONLY } from 'constants';

var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
 var dbo = new dbl("../app.db");
var arr = {};
var rsa = [];
/** helper functions */
var get_project = (image)=>{
	var sp = image.split('_');
	if (sp.length>1)
		return sp[0]+"_"+sp[1];
	else 
		return undefined;
};
/* GET record page. */
router.get('/', function(req, rest, next) {
		dbo.db.all("select * from log_info where t_id ="+ req.query.test, (err, rows) => {
        rows.forEach(row => {
						arr = {};
            arr['image'] =row.log_image;
						arr['info']=row.log_info;
						arr['project']= get_project(row.log_image);
						rsa.push(arr);
        });
        rest.render('record', { title: 'Regression for '+req.query.test , asts: rsa });
				rsa = [];
    });
		//rest.render('record',
		//{title:'Test Results', 
		//res:['data','in','this','form']});
		
});

module.exports = router;
