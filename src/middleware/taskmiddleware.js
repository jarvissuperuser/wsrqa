const TCASE = require("../qualityCaseMan");

let tcase = new TCASE();
let result = [];

module.exports = async(req,rest)=>{
    result = [];
    console.log(req.submit);
    switch (req.submit){
        case "get_case_reports":
            await tcase.get_tests(req,rest);
            break;
        case "get_case_reg":
            await tcase.get_test_reg(req,rest);
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
            rest.sendStatus(404).write(JSON.stringify({"Error":"404 not found"}));
            rest.end(); 
    }
};
