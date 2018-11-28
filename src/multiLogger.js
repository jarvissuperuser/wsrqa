const QB = require("./querybuilder");
let db =new QB();
let self =  null;
class MultiLogger {
    constructor() {
        this.t_id = 0;
        this.tables = ['test', 'log_info', 'test_cases_reg', 'test_cases'];
        this.column = [
            ['t_name', 't_val', 't_timestamp'],
            ['log_info', 't_id', 'log_image'],
            ['tcr_name', 'tcr_specs', 'tcr_username'],
            ['tcr_id', 'tc_name', 'tc_timestamp', 'tc_description', 'tc_actual', 'tc_pass_fail', 'tc_comment']];
        self = this;
    }
    async log(msg, image, target = 'log_info', mode = 0) {
        const point = this.tables.indexOf(target);
        if (point<0)throw ("Target not found");
        let columns = this.column[point];
        if (!this.t_id)
            columns = db.silence(columns,['t_id']);
        const values = [db.str(msg),db.str(image)];
        const query = db.insert(self.tables[point], columns,values);
        let results = 0;
        switch (mode) {
            case 1:
                console.log(`\x1b[31m ${target} Msg: ${msg} > Image ${image} \x1b[0m`);
            case 0:
                results = await db.db.transaction(query);
        }
        return results;
    }
    async update_log(target_id,log_ids = []) {
        let ids = [];
        let target = "";
        if (!Array.isArray(log_ids)) {
            ids.push(log_ids);
            target = this.select_log(target_id);
            if (log_ids === undefined) throw "log_ids can not be null";
        } else {
            ids = log_ids;
        }
        const testTable = this.tables[0];
        const logTable = this.tables[1];
        if (target.length === 0){
            target_id = await this.insert_test();
        }
        const lColEVal = db.val_to_str({t_id:target_id});
        try {
            ids.forEach(async (lId) => {
                const lQuery = db.update(logTable, lColEVal, 'id', lId);
                await db.transaction(lQuery);
            });
        }catch (ex){
            console.log(ex.message);
        }
    }
    async select_log(test_id = 0){
        const lim = db.val_to_str({id:test_id});
        const query = db.slct('*',this.tables[0],lim);
        return await db.transaction(query);
    }
    async insert_test(name = "LogEntry"){
        const tQuery = db.insert(this.tables[0],['t_name'],[name]);
        return await db.db.transaction(tQuery);
    }
}
module.exports = MultiLogger;