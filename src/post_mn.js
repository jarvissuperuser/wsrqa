const assert =  require("assert");
const request = require("request");
const fetch = require("node-fetch");

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
        this.cookies = response.cookies;
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
    getCookie(name){
    	let values = this.processCookies();
    	return values[name];
    }
    processCookies(){
    	let values = {};
	    this.cookies.forEach((cookie)=>{
		    let settings = cookie.split(';');
		    values[settings[0].split('=')[0]]=settings[0].split('=')[1];
	    });
	    return values;
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
    await callback(Main.prototype.response);
};

Main.prototype.dataResponse = async function(resp){

};
Main.prototype.err = function(error){
    console.log("Error: "+error.message);
};
Main.prototype.test = async function(msg,callback){
    Main.prototype.test_msg = msg;
    await callback();
};
Main.prototype.expect = function(comparable){
    return {to:new assert_to(comparable,Main.prototype.test_msg)}
};

Main.prototype.login = async function(url,email,password,callback){
	 return await new Promise((w,f)=>{
	 	let body = "";
		 fetch(url,
				 {
					 "body":`email=${encodeURIComponent(email)}&password=${password}`,
			 "method":"POST"}).then(
			   (res)=>{
	 	 	      body = res.text();

	 	 	      console.log(`email=${(email)}&password=${password}`);
			   }).then(
			   		(text)=> {
					    callback(body);
					    w({data:body,statusCode:res.status,headers:res.headers,cookies:res.headers.get('set-cookie')});
			   }).catch(()=>{f()});
	 });
};

Main.prototype.getCookieValue  =function (name){
	try {
		return Main.prototype.response.getCookie(name);
	}catch (e) {
		return "not set";
	}
};

module.exports = Main;
