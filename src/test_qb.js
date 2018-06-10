let QB = require("./querybuilder");
let qb = new QB();
let obj = {col1:"start",col2:"1",col3:"End"};
console.log(qb.slct('*','table','1=1'));
console.log(qb.update('table',['table="date"',"data_='dt'"],'id',1));
console.log(qb.insert('table',qb.ex_key(obj,[]),qb.ex_val(obj,[])));
//console.log(qb.insert());
console.log(qb.slct('*','table'));
console.log(qb.slct('*','table','1=1'));


