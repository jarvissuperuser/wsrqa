const QB = require("./querybuilder");
const sqlcon = require("./sqlite_con_man");
let qb = new QB();
let db = new sqlcon("../app.db");


class TCase {
    constructor() {
        this.t = ["test_cases_reg",'test_cases'];//db tables
        this.col = [{tcr_name:"Report Name"}
            ,{tc_pass_fail:"pass_fail",tc_name:"TestCase",
            tc_timestamp:"Created",tc_expected:"Expected Result",
            tc_actual:"Actual Result",tc_comment:"Comments",id:"db_id",
            tc_description:"Description"}];
     }
    add_test_reg(req, rest) {
        let render_rows = this.render_rows;
        let t = this.t[0];
        console.log("whats this");
        return new Promise((r) => {
            let new_obj = qb.mute(req, {}, ['submit']);
            new_obj = qb.correc(new_obj, {}, 'tcr_');
            let qry = qb.insert(t, qb.ex_key(new_obj, []), qb.ex_val(new_obj, []));
            console.log(qry);
            db.db.run(qry,function (err) {
                render_rows(req, rest, { msg: 'added' , data:this.lastID}, err);
                r();
            });
        }).catch((err) => {
            rest.write(JSON.stringify(err));
            rest.end();
        });
    }
    update_test_reg(req, rest) {
        let render_rows = this.render_rows;
        let t = this.t[0];
        return new Promise((r) => {
            let new_obj = qb.mute(req, {}, ['submit']);
            new_obj = qb.correc(new_obj, {}, 'tcr_');
            let qry = qb.insert(t, qb.ex_key(new_obj), qb.ex_val(new_obj));
            db.db.run(qry, (err) => {
                render_rows(req, rest, { msg: 'updated' }, err);
                console.log(err);
                r();
            });
        });
    }
    get_tests(req, rest) {
        let render_rows = this.render_rows;
        let result = [];
        let t = this.t[0];
        let limit  = "LIMIT "+ (req.limit?req.limit:10);
        return new Promise((r) => {
            db.db.all(qb.slct("*",t, "1=1 " + limit),
                (err, rows) => {
                    if (rows)
                        rows.forEach(rc => {
                            result.push(rc);
                        });
                    render_rows(req, rest, rows, err);
                    r();
                });
        });
    }
    add_test(req, rest) {
        let render_rows = this.render_rows;
        return new Promise((r) => {
            let new_obj = qb.mute(req, {}, ['submit', 'id']);
            new_obj = qb.correc(new_obj, {}, 'tc_');
            new_obj['tcr_id'] = req.id;
            new_obj['tc_pass_fail'] = req.pass_fail==='on'?'t':'f';
            console.log(new_obj);
            let qry = qb.insert("test_cases", qb.ex_key(new_obj, []), qb.ex_val(new_obj, []));
            db.db.run(qry, function (err) {
                render_rows(req, rest, { msg: "added",data:this.lastID}, err);
                r();
            });
        }).catch((err) => {
            rest.write(JSON.stringify(err));
            rest.end();
        });
    }
    get_test_reg(req, rest) {
        let render_rows = this.render_rows;
        let mute = qb.mute; let replace = qb.replace;
        let result = [];
        let t = this.t[1];
        let col = this.col[1];
        let limit  = "tcr_id="+ (req.case_reg_id?req.case_reg_id:0);
        return new Promise((r) => {
            db.db.all(qb.slct("*",t, limit),
                (err, rows) => {
                    if (rows)
                        rows.forEach(rc => {
                            rc = mute(rc,{},["tcr_id","tc_comment"]);
                            rc = replace(rc,{},col);
                            result.push(rc);
                        });
                    render_rows(req, rest, result, err);
                    r();
                });
        });
    }

    get_test(req, rest) {
        let render_rows = this.render_rows;
        let result = [];
        let t = this.t[0];
        let limit  = "tcr_id="+ (req.case_reg_id?req.case_reg_id:0);
        return new Promise((r) => {
            db.db.all(qb.slct("*",t, limit),
                (err, rows) => {
                    if (rows)
                        rows.forEach(rc => {
                            result.push(rc);
                        });
                    render_rows(req, rest, rows, err);
                    r();
                });
        });
    }
    render_rows(req, rest, obj, err) {
        if (!err) {
            rest.write(JSON.stringify(obj));
            console.log(obj);
        }
        else {
            rest.write(JSON.stringify([err,"Something Failed"]));
            console.log(err);
        }
        rest.end();
    }

}
module.exports = TCase;