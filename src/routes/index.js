//import { O_WRONLY } from 'constants';
const m  = require("../middleware/indexmiddleware");
const Con = require("../setup");
const express = require('express');
let router = express.Router();
let setup = new Con();
let data,el;

/* GET home page. */
router.get('/', function(req, res) {
  m(req,res);
}).get('/configure',function(req,res){
    setup.init("../app.ini");
    data = {};

    if (setup.setup.name)
        for (let a in setup.setup.name) {
            el = {};
            for (let s in setup.setup) {
                el[s] = setup.setup[s][a];
                console.log(el);
            }
            data[a] = (el);
            console.log(a);
        }
    console.log(setup.setup.name,data);
    res.render('configure',{title:'Configure Autotest',data});
});

module.exports = router;
