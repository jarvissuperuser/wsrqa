const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ujc = require('../middleware/ujcomponent');

router.get('/', asyncHandler(async function(req, rest, next) {
    const uj = await ujc(req.query.pr,req.query.mt,req.query.ts);
    rest.write("User Journey Test has Began TYPE:" +req.query.mt +" Project:"+req.query.pr );
    rest.end();
}));

module.exports = router ;