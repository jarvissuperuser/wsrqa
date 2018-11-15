/**
 * compatible with new version
 * */
const dbi = require("../sqlite_con_man");
let QB = require("../querybuilder");
let db = new dbi("../app.db");
let result = [];

module.exports = async(req,rest)=>{
    result = [];
    let limit = "LIMIT "+ (req.query.limit?req.query.limit:10);
    if (req.query.test){
        let result  = await db.transaction("SELECT id AS k, t_name AS n, "+
            "t_timestamp AS t FROM test "+
            "WHERE t_name LIKE \"%"+req.query.test+"%\" " +
            " ORDER BY id DESC " +
            limit+
            " ").catch(err => console.log(err));
            rest.write(JSON.stringify(result));
            rest.end();
    }
    else {
        let result  = await db.transaction("select * from log_info " +
            "where t_id = " + req.query.target + "")
            .catch(err => console.log(err));
        rest.write(JSON.stringify(result));
        rest.end();
    }
};