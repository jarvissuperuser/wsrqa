let QB = require("../querybuilder");
const dbi = require("../sqlite_con_man");
let db = new dbi("../app.db");
let result = [];

let qb = new QB;
let new_obj = {};

module.exports = async(req,rest)=>{
    result = [];
    var limit = "LIMIT "+ (req.limit?req.limit:10);
    if (req.submit === "get_cases")
        db.db.all(qb.slct("*","test_case_reg","1=1 "+limit),
            (err,rows)=>{
                if (!err)
                    return new Promise((resolve)=> {
                        rows.forEach(r => {
                            result.push(r);
                        });
                        rest.write(JSON.stringify(result));
                        rest.end();
                        resolve();
                    });
                else {
                    rest.write(JSON.stringify([err,"limit",result]));
                    rest.end();
                }
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
}