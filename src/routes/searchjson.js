const express = require('express');
const jsonRest= require('../middleware/jsondbmiddleware');
let router = express.Router();

router.get('/', async(req, rest, next) =>{
    await jsonRest(req,rest);
});

module.exports = router ;