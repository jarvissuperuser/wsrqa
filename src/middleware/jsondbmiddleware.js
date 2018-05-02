const dbi = require("../sqlite_con_man");
let db = new dbi("../app.db");
let result = [];

module.exports = async(req,rest)=>{
    result = [];
    var limit = "LIMIT "+ (req.query.limit?req.query.limit:10);
    if (req.query.test)
        db.db.all("SELECT id AS k, t_name AS n, "+
            "t_timestamp AS t FROM test "+
            "WHERE t_name LIKE \"%"+req.query.test+"%\" " +
            " ORDER BY id DESC " +
            limit+
            " ",
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