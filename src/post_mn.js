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
                //.catch((e)=>{console.log("fail",e.message)});
            console.log(this.pass,this.message)
        } catch (e) {
           console.log(this.fail,e.message);
        }
    }

}
class req_response {
    constructor(response){
        //console.log(response);
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
// class Main{
//     constructor(){
//        this.url = "";
//        this.response_data =  {data:"",statusCode:"",headers:[]};
//        this.data = "";
//        this.request = ht.get;
//        this.options = {method:'GET'};
//        this.response = null;
//     }
//
// }
function Main(){
    function constructor(){
        this.url = " ";
       this.data = "";
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
    //console.log(data.headers);
    //console.log(data.cookies);
    callback(Main.prototype.response);
};

Main.prototype.dataResponse = async function(resp){
    //console.log(resp)
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
