const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ujc = require('../middleware/ujcomponent');

router.get('/', asyncHandler(async function(req, rest, next) {
    const uj = await ujc(req.query.p,req.query.m,req.query.t);
    rest.write("User Journey Test has Began TYPE:" +req.query.m +"Project:"+req.query.p );
    rest.end();
}));

module.exports = router ;