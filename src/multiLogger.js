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
                console.log(target, 'Msg:', msg, '>Image', image);
            case 0:
                results = await db.db.transaction(query);
        }
        return results;
    }
}
module.exports = MultiLogger;