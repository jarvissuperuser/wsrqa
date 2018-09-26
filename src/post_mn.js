const ht = require("http");
const assert =  require("assert");

class assert_to{
    constructor(comparable,message){
        this.compara = comparable;
        this.message = message;
        this.assertion =  assert;
    }
    to(){
        return  this;
    }
    async equal(multi){
        await this.assertion.equal(this.compara,multi,this.message);
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
       this.response_data =  {data:"",statusCode:"",headers:[]};
       this.data = "";
       this.request =  null;
       this.options = {method:'GET'};
       this.response = null;
    }
}
let data = "";
Main.prototype.request = (url,cb)=>{
    return new Promise((w)=>{
        ht.request(url,(res)=>{
            cb(res);
            res.on("end",w);
        });

    });
};

Main.prototype.sendRequest = async function(url,callback){
    Main.prototype.url = url;
    await Main.prototype.request(url,async (rs)=> await Main.prototype.dataResponse(rs));
    Main.prototype.response = new req_response({data:data});
    callback(Main.prototype.response);
};
Main.prototype.dataCb =  function (chunk) {
    let string = (new Buffer(chunk));
    data += string.toString();
};
Main.prototype.dataResponse = async function(resp){
    //this.response_data.headers = resp.headers;
    // this.response_data.statusCode = resp.statusCode;
    let prm = new Promise((win,fail)=> {
        resp.on('data', Main.prototype.dataCb);
        resp.on('error', fail);
        resp.on('end', () => {
            win();
        });
    });
    return prm;
};
Main.prototype.err = function(error){
    console.log("Error: "+error.message);
};
Main.prototype.test = function(msg,callback){

};
Main.prototype.fin = function(){
    Main.prototype.response_data['data'] = data;

};
module.exports = Main;
