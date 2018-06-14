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