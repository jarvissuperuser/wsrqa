var express = require('express');
let router = express.Router();

router.get('/', function(req, rest, next) {
    rest.render('userjourney',{title:'Customise User Journey test'});
    //rest.render('record',
    //{title:'Test Results',
    //res:['data','in','this','form']});

});

module.exports = router ;