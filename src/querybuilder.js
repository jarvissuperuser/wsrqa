const sql_con = require('./sqlite_con_man');
let dbc = new sql_con('../app.db');

let self = null;
class QueryBuilder {
    constructor() {
        this.db = dbc;
        self = this;
    }
    slct(selection, table, lim) {
        //TODO: Implement Me
        var qs = "SELECT ";
        qs += this.arrayJustify(selection);
        qs += " FROM ";
        qs += this.arrayJustify(table);
        if (lim !== undefined) {
            qs += " WHERE ";
            qs += lim;
        }
        return qs;
    };
    update(table, colepar, id, val) {
        //TODO: Implement Me
        var qs = "UPDATE " + table + ' SET ';
        qs += this.arrayJustify(colepar);
        qs += " WHERE " + id + " = " + val;
        return qs;
    };
    arrayJustify(obj) {
        //TODO: Implement Me
        var qs = '';
        if (obj !== undefined) {
            if (!obj.hasOwnProperty("substr"))
                qs += obj;
        } else /*if (obj.hasOwnProperty("length")) */ {
            if ((obj[0]) !== undefined && obj.hasOwnProperty("length")) {
                qs += obj[0];
                for (var a = 1; a < obj.length; a++) {
                    qs += ", " + (obj[a] === undefined ? null : obj[a]);
                }
            }
        }
        return qs;
    };

    insert(tble, cols, vals) {
        //TODO: Implement Me --dangerous
        //console.log('datas',cols,vals);
        var qs = "INSERT or REPLACE INTO ";
        qs += tble + "(";
        qs += this.arrayJustify(cols);
        qs += ") VALUES (";
        qs += this.arrayJustify(vals) + ")";
        return qs;
    };
    valuate(data, arrEmp) {
        data.forEach((element, idx) => {
            arrEmp.push(element);
        });
        return arrEmp;
    };
    ex_key(data, arrEmp) {
        for (var element in data) {
            arrEmp.push(element);
        }
        return arrEmp;
    };
    ex_val(data, arrEmp) {
        for (var element in data) {
            arrEmp.push(this.str(data[element], []));
        }
        return arrEmp;
    };
    val_to_str(data) {
        let str = "";
        for(var e in data){
            str += e + "=" + this.str(data[e]) + ",";
        }     
        return str.substr(0,str.length-1);
    }
    str(element) {
        if (isNaN(element))
            return '"' + element + '"';
        else
            return (element);
    }
    correc (old,new_,pre) {
        for (let a in old){
            new_[pre + a] = old[a];
        }
        return new_;
    }
    mute(old,new_,muted){
        let ismuted = (current)=>{
            let tf = false;
            muted.some((el)=>{
                tf = el === current;
                return tf;
            });
            return tf;
        };
        for (let a in old){
            if(!ismuted(a)){
                new_[a] = old[a];
            }
        }
        return new_;
    }
    replace(old,new_,obj){
        for (let a in old){
                new_[obj[a]] = old[a];

        }
        return new_;
    }
    async transaction(qry){
        let results=  [];
        return new Promise((w,f)=>{
            self.dbi.run(qry,(err,rows)=>{
                if (err){f(err)}
                if (qry.indexOf('SELECT') > -1) {
                    rows.forEach((row) => {
                        results.push(row);
                    });
                    w(results)
                }
                else{
                    w(rows)
                }
            });
        });
    }
    silence(old,silenced=[],new_=[]){
        let search = function(val){
            return silenced.some((el)=>{return val===el });
        };
        old.forEach((value)=>{
            if (!search(value))
                new_.push(value);
        });
        return new_;
    }
}
module.exports = QueryBuilder;