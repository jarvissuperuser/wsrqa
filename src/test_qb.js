let QB = require("./querybuilder");
let qb = new QB();
let obj = {col1:"start",col2:"1",col3:"End"};
let new_obj = {};
console.log(qb.slct('*','table','1=1'));
console.log(qb.update('table',qb.val_to_str(obj),'id',1));
console.log(qb.insert('table',qb.ex_key(obj,[]),qb.ex_val(obj,[])));
console.log(qb.val_to_str(obj));
console.log(qb.correc(obj,new_obj,"tc_"));
console.log(qb.slct('*','table'));
console.log(qb.slct('*','table','1=1'));


