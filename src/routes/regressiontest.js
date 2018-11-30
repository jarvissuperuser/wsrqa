const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const asyncHandler = require('express-async-handler');

// console.log(middleware());
/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
	 middleware(req.query.p ,req.query.m,req.query.t);
	 res.write("Running test on " + req.query.p + req.query.m);
	 res.end();
  // res.render('index', { title: 'Express' });
}));

module.exports = router;
