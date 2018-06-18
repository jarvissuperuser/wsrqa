const QB = require("./querybuilder");
const sqlcon = require("./sqlite_con_man");
let qb = new QB();
let db = new sqlcon("../app.db");


class TCase{
    constructor(){}
    add_test_reg(req,rest){
        return new Promise((r)=>{
        });
    }
    update_test_reg(req,rest){
        return new Promise((r)=>{
            
        });
    }
    get_test_reg(req,rest){
        return new Promise((r)=>{
            db.db.all(qb.slct("*","test_case_reg","1=1 "+limit),
            (err,rows)=>{
                if (!err){
                        rows.forEach(r => {
                            result.push(r);
                        });
                        rest.write(JSON.stringify(result));
                        rest.end();
                        r();
                    }
                else {
                    rest.write(JSON.stringify([err,"limit",result]));
                    rest.end();
                    r();
                }
            });

        });
    }
    add_test(req,rest){
        return new Promise((r)=>{
            
        });
    }
    get_test(req,rest){
        return new Promise((r)=>{
            
        });
    }

}