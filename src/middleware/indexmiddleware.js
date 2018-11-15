/**
 * failed hook
 * */
const dbl = require("../sqlite_con_man");
/* Render The Data for pictures in table for*/
const dbo = new dbl("../app.db");
const L = require("../multiLogger");
let arr = {};
let rsa = [];

let indexMiddle = async (req,res) => {
    var offset = isNaN(req.query.offset)?0:req.query.offset;
    var end = isNaN(req.query.limit)?5:req.query.limit;
    var next = (parseInt(offset)+parseInt(end));
    let rows = await dbo.transaction("select t_name,t_val,t_timestamp,id from test order by t_timestamp desc limit "+
        end+" offset "+offset).catch(err => console.log(err));
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

     res.render('index', { title: 'Tests Performed', asts: rsa });
};
module.exports =  indexMiddle;

