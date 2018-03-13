//import { O_WRONLY } from 'constants';

var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
var dbo = new dbl("../app.db");
var arr = [];
/* GET home page. */
router.get('/', function(req, res, next) {
    dbo.db.all("select * from test", (err, rows) => {
        rows.forEach(row => {
            arr.push(row.t_name);
        });
        res.render('index', { title: 'Express', asts: arr });
    });

});

module.exports = router;