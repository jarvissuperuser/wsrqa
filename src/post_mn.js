const assert =  require("assert");
const request = require("request");

class assert_to{
    constructor(comparable,message){
        this.compara = comparable;
        this.message = message;
        this.pass = "\x1b[32m PASS\x1b[0m";
        this.fail = "\x1b[31m FAIL\x1b[0m";
    }
    to(){
        return  this;
    }
    async equal(multi){
        try {
            await assert.equal(this.compara, multi, this.message);
            console.log(this.pass,this.message)
        } catch (e) {
           console.log(this.fail,e.message);
        }
    }

}
class req_response {
    constructor(response){
        this.resp = response.data;
        this.statusCode = response.statusCode;
        this.headers= response.headers;
    }
    json(){
        return JSON.parse(this.resp);
    }
    status(){
        return this.statusCode;
    }
    getHeader(name){
        return this.headers[name];
    }
}

function Main(){
    function constructor(){
       this.request =  null;
       this.options = {method:'GET'};
       this.response = null;
    }
}
let data = "";
Main.prototype.request = (url,cb)=>{
    return new Promise((w,f)=>{
        request(url,(err,res,body)=>{
            cb(body);
            w({data:body,statusCode:res.statusCode,headers:res.headers,cookies:res.headers['set-cookie']});
            if (err){f({error:err,headers:res})}
        });

    });
};

Main.prototype.sendRequest = async function(url,callback){
    Main.prototype.url = url;
    data = await Main.prototype.request(url,async (rs)=> await Main.prototype.dataResponse(rs));
    Main.prototype.response = new req_response(data);
    callback(Main.prototype.response);
};

Main.prototype.dataResponse = async function(resp){

};
Main.prototype.err = function(error){
    console.log("Error: "+error.message);
};
Main.prototype.test = function(msg,callback){
    Main.prototype.test_msg = msg;
    callback();
};
Main.prototype.expect = function(comparable){
    return {to:new assert_to(comparable,Main.prototype.test_msg)}
};

module.exports = Main;
