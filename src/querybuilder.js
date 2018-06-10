const sql_con = require('./sqlite_con_man');
let dbc = new sql_con('../app.db');

class QueryBuilder {
    constructor(){
        this.db = dbc;
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
    arrayJustify (obj) {
        //TODO: Implement Me
        var qs = '';
        if (obj!==undefined) {
          if(!obj.hasOwnProperty("substr"))
            qs += obj;
        } else /*if (obj.hasOwnProperty("length")) */ {
          if ((obj[0]) !== undefined && obj.hasOwnProperty("length")){
            qs += obj[0];
            for (var a = 1; a < obj.length; a++) {
              qs += ", " + (obj[a]===undefined?null:obj[a]);
            }
          }
        }
        return qs;
      };

      insert (tble, cols, vals) {
        //TODO: Implement Me --dangerous
        //console.log('datas',cols,vals);
        var qs = "INSERT or REPLACE INTO ";
        qs += tble + "(";
        qs += this.arrayJustify(cols);
        qs += ") VALUES (";
        qs += this.arrayJustify(vals) + ")";
        return qs;
      }
    
}

module.exports =QueryBuilder;