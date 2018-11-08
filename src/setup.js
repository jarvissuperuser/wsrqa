const fs  = require('fs-extra');

class Setup{
    constructor(){
        this.setup = {};
        this.config_file = "";
        this.errNoConfig = "No config File in setup"; 
    }
    verify_file (filename) {
        this.config_file = filename?filename:"";
        let str_set = fs.readFileSync(filename).toString();
        this.setup = JSON.parse(str_set?str_set:'{}'); 
    }
    add_to_file(publication,type,value){
        if (this.config_file){
            let data = this.setup[type];
            if (typeof data === 'object'){
                data[publication] = value;
            }else{
                this.setup[type] = {};
                let data = this.setup[type];
                data[publication] = value;               
            }
            this.update_file();
        }
        else {
            throw Error(this.errNoConfig);
        }
    }
    get_values(publication,type){
        let raw = this.setup[type?type:"empty"][publication];
        return raw?raw:"";
    }
    update_file(){
        if (this.config_file){
            let data = JSON.stringify(this.setup);
            fs.writeFileSync(this.config_file,data,"utf8");
        }
        else
        {
            throw Error(this.errNoConfig);
        }
    }
    get_url(publication,type){
        let t = type?type:'empty';
        let base = "";
        base = this.get_values(publication,'base');
        return  (type==="base"||type==="empty")?base:base + this.get_values(publication,t);

    }
    init(filename){
        try{
            this.verify_file(filename);
        }catch(er){
            console.log(er.message);
            fs.createFileSync(this.config_file);
            this.update_file();
        }
    }
}
module.exports = Setup;
// TODO: Read File