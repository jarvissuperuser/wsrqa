const QB = require("./querybuilder");
const sqlcon = require("./sqlite_con_man");
let qb = new QB();
let db = new sqlcon("../app.db");


class TCase {
    constructor() { }
    add_test_reg(req, rest) {
        let render_rows = this.render_rows;
        return new Promise((r) => {
            new_obj = qb.mute(req, {}, ['submit']);
            new_obj = qb.correc(new_obj, {}, 'tcr_');
            qry = qb.insert("test_case_reg", qb.ex_key(new_obj, []), qb.ex_val(new_obj, []));
            db.db.all(qry, (err, rows) => {
                render_rows(req, rest, { msg: 'added' }, err);
                r();
            });
        }).catch((err) => {
            rest.write(JSON.stringify(err));
            rest.end();
        });;
    }
    update_test_reg(req, rest) {
        let render_rows = this.render_rows;
        return new Promise((r) => {
            new_obj = qb.mute(req, {}, ['submit']);
            new_obj = qb.correc(new_obj, {}, 'tcr_');
            qry = qb.insert("test_cases", qb.ex_key(new_obj), qb.ex_val(new_obj));
            db.db.all(qry, (err, rows) => {
                render_rows(req, rest, { msg: 'updated' }, err);
                r();
            });
        });
    }
    get_tests() {
        let render_rows = this.render_rows;
        let result = [];
        return new Promise((r) => {
            db.db.all(qb.slct("*", "test_case_reg", "1=1 " + limit),
                (err, rows) => {
                    if (rows)
                        rows.forEach(r => {
                            result.push(r);
                        });
                    render_rows(req, rest, rows, err);
                    r();
                });
        });
    }
    add_test(req, rest) {
        let render_rows = this.render_rows;
        return new Promise((r) => {
            new_obj = qb.mute(req, {}, ['submit', 'id']);
            new_obj = qb.correc(new_obj, {}, 'tc_');
            new_obj['tcr_id'] = req.id;
            qry = qb.insert("test_cases", qb.ex_key(new_obj, []), qb.ex_val(new_obj, []));
            db.db.all(qry, (err) => {
                render_rows(req, rest, { msg: "added" }, err);
                r();
            });
        }).catch((err) => {
            rest.write(JSON.stringify(err));
            rest.end();
        });;
    }
    get_test(req, rest) {
        return new Promise((r) => {
            r();
        });
    }
    render_rows(req, rest, obj, err) {
        if (!err) {
            rest.write(JSON.stringify(obj));
        }
        else {
            rest.write(JSON.stringify([err.message, "limit", qry]));
        }
        rest.end();
    }

}
module.exports = TCase;