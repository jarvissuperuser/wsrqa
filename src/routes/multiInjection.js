const express = require('express');
const router = express.Router();
const middleware = require('../middleware/injectionengine');
const asyncHandler = require('express-async-handler');

// console.log(middleware());
/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {



	res.write("Running test on " + req.query.p + req.query.m);
	res.end();
	// res.render('index', { title: 'Express' });
}));

module.exports = router;