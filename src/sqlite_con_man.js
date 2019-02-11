var init = require("sqlite3").verbose();
var db = null;
var qry = "";
var datamulti = [];
var counter = 0;
var list = [];
// its going to be terminal app for now

var argv = "";

var manager = function(path_name) {
    db = new init.Database(path_name);
};
manager.prototype.db = db;
manager.prototype.data = [];
/**
 @param lst
*/
manager.prototype.multiquery = async function(lst) {
    if (Array.isArray(lst))
        lst.forEach(async qry => {
            await manager.prototype.transaction(qry).catch(err => {
                console.log(err);
            });
        });
    else {
        let arr = lst.split(';');
        arr.forEach(async qry => {
            await manager.prototype.transaction(qry).catch(err => {
                console.log(err);
            });
        });
    }
    return true;
};

manager.prototype.transaction = function(qry) {
    return new Promise((w,f) => {
        if(qry.indexOf('INSERT') < 0) {
            db.all(qry, (err, row) => {
                if (err) f(err);
                w(row);
            });
        }else
        {
            db.run(qry,function (err) {
                if(err)f(err);
                w(this.lastID);
            });
        }
    });
};


module.exports = manager;