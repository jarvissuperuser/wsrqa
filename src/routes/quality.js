let express = require('express');
let router = express.Router();
let middleware = require("../middleware/taskmiddleware");

router.get('/new', async(req, rest, next) =>{
    rest.render('quality',{title:'New QA Reporting',view:'new'});
}).get('/qa', async(req, rest, next) =>{
    rest.render('quality',{title:'QA by WhoX',view:'adding'});
}).post('/add',async(req, rest, next) =>{
    //rest.render('quality',{title:'QA by WhoX',view:'adding'});
    let q=req.body;
    middleware(q,rest);
});

module.exports = router ;