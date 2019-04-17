const express = require('express');
const router = express.Router();
const subtest = require('../Subscriptions');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('dev',{title:'Dev Utilities'});
}).post('/actions', async function (req,res) {
    // res.render('dev', {title:"Action results",results:{}});
    const data = await subtest(req.body);
    res.send(data);
    res.end();
});

module.exports = router;
