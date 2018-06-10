let QB = require("./querybuilder");
let qb = new QB();

console.log(qb.slct('*','table','1=1'));
console.log(qb.update('table','table="date"','id',1));
console.log(qb.insert('table',['col1','col2'],['data1','data2']));
console.log(qb.slct('*','table'));
console.log(qb.slct('*','table','1=1'));


