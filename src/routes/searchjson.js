const express = require('express');
let router = express.Router();
const dbi = require("../sqlite_con_man");
let db = new dbi("../app.db");
let result = [];
router.get('/', async(req, rest, next) =>{
    result = [];

    if (req.query.test)
        db.db.all("select id as k, t_name as n from test "+
            "where t_name like \"%"+req.query.test+"%\"",
            (err,rows)=>{
                return new Promise((resolve)=> {
                    rows.forEach(r => {
                        result.push(r);
                    });
                    rest.write(JSON.stringify(result));
                    rest.end();
                    resolve();
                });
            });
    else
        db.db.all("select * from log_info "+
            "where t_id = "+req.query.target +";",
            (err,rows)=>{
                return new Promise((resolve,reject)=> {
                    if (err) {
                        rest.write(JSON.stringify(result));
                        rest.end();
                        reject(err);
                    }
                    rows.forEach(r => {
                        result.push(r);
                    });
                    rest.write(JSON.stringify(result));
                    rest.end();
                    resolve();
                });
            });

});

module.exports = router ;