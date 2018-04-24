var express = require('express');
let router = express.Router();

router.get('/', function(req, rest, next) {
    rest.render('compare',{title:'Compare Test Results'});

});

module.exports = router ;