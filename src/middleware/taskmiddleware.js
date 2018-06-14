let QB = require("../querybuilder");
const dbi = require("../sqlite_con_man");
let db = new dbi("../app.db");
let result = [];

let qb = new QB;
let new_obj = {};

module.exports = async(req,rest)=>{
    result = [];
    var limit = "LIMIT "+ (req.limit?req.limit:10);

    switch (req.submit){
        case "get_case_reports":
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
            break;
        case "add_case_reg":
            new_obj = qb.mute(req,{},['submit']);
            new_obj = qb.correc(new_obj,{},'tcr_');
            let qry = qb.insert("test_case_reg",qb.ex_key(new_obj),qb.ex_val(new_obj));  
            db.db.all(qry, (err,rows) => {
                if (!err)
                    return new Promise((resolve)=> {
                        rest.write(JSON.stringify({figure}));
                        rest.end();
                        resolve();
                    });
                else {
                    rest.write(JSON.stringify([err,"limit",result]));
                    rest.end();
                }
            });
            break;
        case "update_case_reg":
            break;
        case "add_case":
            new_obj = qb.mute(req,{},['submit']);
            new_obj = qb.correc(new_obj,{},'tcr_');
            let qry = qb.insert("test_case_reg",qb.ex_key(new_obj),qb.ex_val(new_obj));  
            db.db.all(qry, (err,rows) => {
                if (!err)
                    return new Promise((resolve)=> {
                        rest.write(JSON.stringify({figure}));
                        rest.end();
                        resolve();
                    });
                else {
                    rest.write(JSON.stringify([err,"limit",result]));
                    rest.end();
                }
            });
            break;
        case "update_case":
            break;
        case "get_cases": 
            let tc_id = req.id ;
            db.db.all(qb.slct("*","test_case","tcr_id="+tc_id+" "+limit),
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
            break;
        default:
            rest.write(JSON.stringify([]));
            rest.end(); 
    };
}