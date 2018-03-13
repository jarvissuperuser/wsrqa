//import { O_WRONLY } from 'constants';

var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
var dbo = new dbl("../app.db");
var arr = {};
/* GET home page. */
router.get('/', function(req, res, next) {
    dbo.db.all("select * from test", (err, rows) => {
        if (rows)
				rows.forEach(row => {
            var name = row.t_name;
            arr[name] =row.id;
        });
				//if (rows)
        res.render('index', { title: 'Tests Performed', asts: arr });

				dbo.db.close();

    });

});

module.exports = router;
