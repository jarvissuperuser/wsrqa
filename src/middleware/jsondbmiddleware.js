/**
 * compatible with new version
 * */
//const dbi = require("../sqlite_con_man");
const QB = require("../querybuilder");
//let db = new dbi("../app.db");
let result = [];
let d = new QB();
module.exports = async(req,rest)=>{
    result = [];
    let limit = "LIMIT "+ (req.query.limit?req.query.limit:10);
    if (req.query.test){
        //const lim = "t_name LIKE \"%"+req.query.test+"%\" " +
        const lim = "log_image LIKE \"%"+req.query.test+"%\" OR log_info LIKE \"%"  +req.query.test+"%\" " +
            " ORDER BY id DESC " + limit + " ";
        const qry = await d.slct(['id AS k','log_info AS t','log_image AS n'],'log_info', lim);
        //const qry =  await d.slct(['id AS k', 't_name AS n','t_timestamp AS t'],'test',lim);
        let result  = await d.db.transaction(qry).catch(err => console.log(err));
        console.log(result, 'results');
        rest.write(JSON.stringify(result));
        console.log("\x1b[32m Searching \x1b[0m");
        rest.end();
    }
    else {
        const lim = `t_id=${req.query.target} OR id=${req.query.target}`;
        const qry = await d.slct(['id AS k','log_info AS t','log_image AS n'],'log_info',lim );
        let result  = await d.db.transaction(qry)
            .catch(err => console.log(err));
        rest.write(JSON.stringify(result));
        console.log("\x1b[33m Image Selection  \x1b[0m", result);
        rest.end();
    }
};