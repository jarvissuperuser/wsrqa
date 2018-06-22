

var dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
var dbo = new dbl("../app.db");
var arr = {};
var rsa = [];


let indexMiddle = (req,res) => {
    var offset = isNaN(req.query.offset)?0:req.query.offset;
    var end = isNaN(req.query.limit)?5:req.query.limit;
    var next = (parseInt(offset)+parseInt(end));
    dbo.db.all("select t_name,t_val,t_timestamp,id from test order by t_timestamp desc limit "+ end+" offset "+offset, (err, rows) => {
        rsa = [];
        if (rows)
            rows.forEach(row => {
                arr = [];
                var name = row.t_name +"@"+row.t_timestamp+">> "+row.t_val+"%";
                arr['id'] =row.id;
                arr['name'] = name;
                arr['total'] = rows.length;
                arr['point'] = offset;
                arr['next'] = rows.length%parseInt(end)!==0?0:next;
                rsa.push(arr);
            });
        //if (rows)
        res.render('index', { title: 'Tests Performed', asts: rsa });

        //dbo.db.close();

    });
};
module.exports =  indexMiddle;