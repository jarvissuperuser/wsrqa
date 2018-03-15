//import { O_WRONLY } from 'constants';

var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
 var dbo = new dbl("../app.db");
var arr = {};
var rsa = [];
/* GET home page. */
router.get('/', function(req, rest, next) {
		dbo.db.all("select * from log_info where t_id ="+ req.query.test, (err, rows) => {
        rows.forEach(row => {
						arr = {};
            arr['image'] =row.log_image;
						arr['info']=row.log_info;
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
