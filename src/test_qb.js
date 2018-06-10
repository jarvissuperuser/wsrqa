let QB = require("./querybuilder");
let qb = new QB();

console.log(qb.slct('*','table','1=1'));
console.log(qb.update('table',['table="date"',"data_='dt'"],'id',1));
console.log(qb.insert('table',['col1','col2','col3'],qb.valuate(['data1','data2',"1"],[])));
console.log(qb.slct('*','table'));
console.log(qb.slct('*','table','1=1'));


