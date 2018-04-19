const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ujc = require('../middleware/ujcomponent');

router.get('/', asyncHandler(async function(req, rest, next) {
    const uj = await ujc(req.query.p,req.query.m,req.query.t);
    rest.write("User Journey Test has Began");
    rest.end();
    //rest.render('userjourney',{title:'Customise User Journey test'});
    //rest.render('record',
    //{title:'Test Results',
    //res:['data','in','this','form']});

}));

module.exports = router ;