var express = require('express');
var router = express.Router();
var dbl = require("../sqlite_con_man");

/* Render The Data for pictures in table for*/
//var dbo = new dbl("../app.db");
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', asts: ["what", "is", "new"] });
});

module.exports = router;