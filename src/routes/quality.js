let express = require('express');
let router = express.Router();
let middleware = require("../middleware/jsondbmiddleware");

router.get('/new', async(req, rest, next) =>{
    rest.render('quality',{title:'New QA Reporting',view:'new'});
}).get('/qa', async(req, rest, next) =>{
    rest.render('quality',{title:'QA by WhoX',view:'adding'});
});

module.exports = router ;