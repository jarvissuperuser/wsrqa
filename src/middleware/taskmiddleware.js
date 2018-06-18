const QB = require("../querybuilder");
const dbi = require("../sqlite_con_man");
const TCASE = require("../qualityCaseMan");
let db = new dbi("../app.db");

let tcase = new TCASE();
let result = [];
let qb = new QB;
let new_obj = {};
let qry = "";

module.exports = async(req,rest)=>{
    result = [];
    console.log(req.submit);
    switch (req.submit){
        case "get_case_reports":
            await tcase.get_tests(req,rest);
            break;
        case "add_case_reg":
            console.log("cases");
            await tcase.add_test_reg(req,rest);
            break;
        case "update_case_reg":
            await tcase.update_test_reg(req,rest);
            break;
        case "add_case":
            tcase.add_test(req,rest);
            break;
        case "update_case":
            tcase.update_test_reg(req,rest);
            break;
        case "get_cases":
            tcase.get_test(req,rest);
            break;
        default:
            rest.write(JSON.stringify([]));
            rest.end(); 
    };
}