//import { O_WRONLY } from 'constants';

var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
var dbo = new dbl("../app.db");
var arr = {};
var rsa = [];
/* GET home page. */
router.get('/', function(req, res, next) {
    dbo.db.all("select * from test", (err, rows) => {
			rsa = [];
        if (rows)
				rows.forEach(row => {
					arr = [];
            var name = row.t_name +"@"+row.t_timestamp+">> "+row.t_val+"%";
            arr['id'] =row.id;
						arr['name'] = name;
						rsa.push(arr)
        });
				//if (rows)
        res.render('index', { title: 'Tests Performed', asts: rsa });

				//dbo.db.close();

    });

});

module.exports = router;
