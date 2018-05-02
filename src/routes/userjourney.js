var express = require('express');
let router = express.Router();

router.get('/', function(req, rest, next) {
    rest.render('userjourney',{title:'Customise User Journey test'});
});

module.exports = router ;