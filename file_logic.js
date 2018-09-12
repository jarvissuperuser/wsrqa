const mmnt = require("moment");


class file_logic{
    constructor(){
        this.file_var = [];
        this.datetime = mmnt().format("MM-D-YY-h-mm-s");
        this.testOptions = ["yes","no"];
    }
    file_build(op,test){
        var res="";
        var fv = this.file_var;
        var t = this.testing;
        switch (op) {
            case "home":
            case "empty":
                res=[fv[0],t(test)].join('-');
                break;
            default:
                res=fv.join('-');
                if (test===this.testOptions[0]){
                    res+=fv.join('-')+'-'+t(test);
                }


        }
        return res;
    }
    testing(test){
        let res = "";
        switch (test) {
            case this.testOptions[0]:
                res += this.datetime;
                break;
            case this.testOptions[1]:
                break;
            default:
                break;
        }
        return res;
    }

}
module.exports = file_logic;