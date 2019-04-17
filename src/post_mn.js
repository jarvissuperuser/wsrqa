const assert =  require("assert");
const request = require("request");

/***
 * TODO
 * --> investigate soap to json
 * ----> processing cost for conversion.
 * NB!! > is edge case most likely
 * */

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

        return (typeof this.resp === "object")? this.resp :JSON.parse(this.resp);
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
/**
 * @param url string
 * @param cb function
 * @param pData { method:"method", data:[<{name:"",value:""}>]}
 * */
Main.prototype.request = (url,cb,pData = undefined)=>{
    return new Promise((w,f)=>{
        if(!pData) {
            request(url, (err, res, body) => {
                cb(body);
                if (res&&res.statusCode&&res.headers)
                    w({data: body, statusCode: res?res.statusCode:500, headers: res?res.headers:"none", cookies: res?res.headers['set-cookie']:"none"});
                else
                    f({error: "failed to load",obj:res,msg:"no status code or headers"});
                if (err) {
                    f({error: err, headers: res})
                }
            });
        }else{
            request(url, pData,
                (err, res, body) => {
                cb(body);
                w({data: body, statusCode: res?res.statusCode:500, headers: res.headers, cookies: res.headers['set-cookie']});
                if (err) {
                    f({error: err, headers: res})
                }
            });
        }
    });
};

Main.prototype.sendRequest = async function(url,callback,rData = undefined){
    Main.prototype.url = url;
    data = await Main.prototype.request(url,async (rs)=> await Main.prototype.dataResponse(rs),rData).catch(e=>console.log(e.message));
    if (data) {
        Main.prototype.response = new req_response(data);
        await callback(Main.prototype.response);
    }else
        await callback(null);
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
	 	console.log(url);

	 	request.post(url,
	 		{
		    formData: {
		    	email:email, password:password}
	 	},
		    (err, res, body) => {
			    if (err) {
				    f({error: err, headers: res});
			    }
			    callback(body);
			    w({data: body, statusCode: res.statusCode, headers: res.headers, cookies: res.headers['set-cookie']});
		    });
		 // request(url, pData,);
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
