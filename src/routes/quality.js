let express = require('express');
let middleware = require("../middleware/taskmiddleware");

let router = express.Router();

router.get('/new', async(req, rest, next) =>{
    rest.render('quality',{title:'New QA Reporting',view:'new'});
}).get('/qa', async(req, rest, next) =>{
    rest.render('quality',{title:'QA',view:'adding'});
}).post('/add',async(req, rest, next) =>{
    let q=req.body;
    middleware(q,rest);
});

module.exports = router ;