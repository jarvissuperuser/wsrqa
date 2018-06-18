let QB = require("../querybuilder");
const dbi = require("../sqlite_con_man");
let db = new dbi("../app.db");
let result = [];

let qb = new QB;
let new_obj = {};
let qry = "";

module.exports = async(req,rest)=>{
    result = [];
    var limit = "LIMIT "+ (req.limit?req.limit:10);

    switch (req.submit){
        case "get_case_reports":
            
            break;
        case "add_case_reg":
            new_obj = qb.mute(req,{},['submit']);
            new_obj = qb.correc(new_obj,{},'tcr_');
            qry = qb.insert("test_case_reg",qb.ex_key(new_obj,[]),qb.ex_val(new_obj,[]));  
            db.db.all(qry, (err,rows) => {
                if (!err)
                    return new Promise((resolve)=> {
                        rest.write(JSON.stringify({figure:''}));
                        rest.end();
                        resolve();
                    }).catch((err)=>{
                        rest.write(JSON.stringify(err));
                        rest.end();
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
            new_obj = qb.mute(req,{},['submit','id']);
            new_obj = qb.correc(new_obj,{},'tc_');
            new_obj['tcr_id'] = req.id; 
            qry = qb.insert("test_cases",qb.ex_key(new_obj,[]),qb.ex_val(new_obj,[]));  
            db.db.all(qry, (err,rows) => {
                if (!err)
                    return new Promise((resolve)=> {
                        rest.write(JSON.stringify({msg:"added"}));
                        rest.end();
                        resolve();
                    }).catch((err)=>{
                        rest.write(JSON.stringify(err));
                        rest.end();
                    });
                else {
                    rest.write(JSON.stringify([err.message,"limit",qry]));
                    rest.end();
                }
            });
            break;
        case "update_case":
        new_obj = qb.mute(req,{},['submit']);
        new_obj = qb.correc(new_obj,{},'tcr_');
        qry = qb.insert("test_cases",qb.ex_key(new_obj),qb.ex_val(new_obj));  
        db.db.all(qry, (err,rows) => {
            if (!err)
                return new Promise((resolve)=> {
                    rest.write(JSON.stringify({msg:updated}));
                    rest.end();
                    resolve();
                }).catch((err)=>{
                    rest.write(JSON.stringify(err));
                    rest.end();
                });
            else {
                rest.write(JSON.stringify([err,"limit",result]));
                rest.end();
            }
        });
        break;
            break;
        case "get_cases": 
            let tc_id = req.id ;
            db.db.all(qb.slct("*","test_cases","tcr_id="+tc_id+" "+limit),
            (err,rows)=>{
                if (!err)
                    return new Promise((resolve)=> {
                        rows.forEach(r => {
                            result.push(r);
                        });
                        rest.write(JSON.stringify(result));
                        rest.end();
                        resolve();
                    }).catch((err)=>{
                        rest.write(JSON.stringify(err));
                        rest.end();
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