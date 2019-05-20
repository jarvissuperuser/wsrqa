const QB = require("./querybuilder");
const PM = require("./post_mn");
const qb = new QB();
const pm = new PM();
let obj = {col1:"start",col2:"1",col3:"End"};
let new_obj = {};
let new_1 = {};
console.log(qb.update('table',qb.val_to_str(obj),'id',1));
console.log(qb.insert('table',qb.ex_key(obj,[]),qb.ex_val(obj,[])));
console.log(qb.val_to_str(obj));
console.log(qb.correc(obj,new_obj,"tc_"));
console.log(qb.mute(obj,new_1,['col2']));
console.log(qb.slct('*','table'));
console.log(qb.slct('*','table','1=1'));
console.log(qb.silence(qb.ex_key(obj,[]),['col1']));

(async function main(){
    await pm.test("SELECT STATEMENT:>>"+qb.slct('*','table','1=1'),async ()=>{
        await pm.expect(qb.slct('*','table','1=1'))
            .to.equal("SELECT * FROM table WHERE 1=1");
    });
    await pm.test("HAS SELECT",async ()=>{
        // await pm.expect(qb.slct('*','table','1=1'))
        //     .to.equal("SELECT * FROM table WHERE 1=1");
        await pm.expect(qb.slct('*','table','1=1').indexOf("SELECT")>=0)
            .to.equal(true);

    });
    await pm.test("HAS FROM?",async ()=>{
        await pm.expect(qb.slct('*','table','1=1').indexOf("FROM")>=0)
            .to.equal(true);

    });
    await pm.test("HAS APPROPRIATE WHERE?",async ()=>{
        await pm.expect(qb.slct('*','table','1=1').indexOf("WHERE")>=0)
            .to.equal(true);
    });
    await pm.test("HASN'T APPROPRIATE WHERE?",async ()=>{

        await pm.expect(qb.slct('*','table'," ").indexOf("WHERE")>=0)
            .to.equal(false);
    });
    await pm.test("INSERT STATEMENT:>>"+qb.insert('table',qb.ex_key(obj,[]),qb.ex_val(obj,[]))
        ,async ()=>{
        await pm.expect(qb.insert('table',qb.ex_key(obj,[]),qb.ex_val(obj,[])))
            .to.equal('INSERT or REPLACE INTO table(col1,col2,col3) VALUES ("start",1,"End")');
    });
    await pm.test("HAS SELECT",async ()=>{
        // await pm.expect(qb.slct('*','table','1=1'))
        //     .to.equal("SELECT * FROM table WHERE 1=1");
        await pm.expect(qb.slct('*','table','1=1').indexOf("SELECT")>=0)
            .to.equal(true);

    });
    await pm.test("HAS FROM?",async ()=>{
        await pm.expect(qb.slct('*','table','1=1').indexOf("FROM")>=0)
            .to.equal(true);

    });
    await pm.test("HAS APPROPRIATE WHERE?",async ()=>{
        await pm.expect(qb.slct('*','table','1=1').indexOf("WHERE")>=0)
            .to.equal(true);
    });
    await pm.test("HASN'T APPROPRIATE WHERE?",async ()=>{

        await pm.expect(qb.slct('*','table'," ").indexOf("WHERE")>=0)
            .to.equal(false);
    });
    console.log("done");
})();
