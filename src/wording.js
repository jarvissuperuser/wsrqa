const { JSDOM }= require("jsdom");
/***
 * @summary A library aid with testing comparing with html text samples
 */

WordingTest =   function () {
};

WordingTest.prototype.htmlUnEscape=function(htmlString){
		return (new (new JSDOM(``,{runScripts:"dangerously"})).window.DOMParser)
			.parseFromString(htmlString,'text/html').querySelector("body").textContent.toString();
};

WordingTest.prototype.textCleaner = function(haystack,needle) {
	let new_haystack =  WordingTest.prototype.htmlUnEscape(haystack.toLowerCase());
	let new_needle = WordingTest.prototype.htmlUnEscape(needle.toLowerCase());
	specialCharacters.forEach(c=>{
		while(new_needle.indexOf(c)>-1||new_haystack.indexOf(c)>-1) {
			new_haystack = new_haystack.replace(c, "");
			new_needle = new_needle.replace(c, "");
		}
	});
	return {haystack:new_haystack,needle:new_needle};
};

WordingTest.prototype.strictCheck = function(haystack,needle){
	return haystack.indexOf(needle)>-1;
};

WordingTest.prototype.insensitiveCheck= function(haystack,needle) {
	return haystack.toLowerCase().indexOf(needle.toLowerCase())>-1;
};

WordingTest.prototype.looseCheck= function(haystack,needle){
	let obj = WordingTest.prototype.textCleaner(haystack,needle);
	return WordingTest.prototype.insensitiveCheck(obj.haystack,obj.needle);
};

WordingTest.prototype.testWording = function(haystack,needle,strategy = "STRICT"){
	let FOUND = false;
	switch (strategy.toLowerCase()) {
		case "s":
		case "strict":
			FOUND = WordingTest.prototype.strictCheck(haystack,needle);
			break;
		case "i":
		case "insensitive":
		case "insens":
			FOUND = WordingTest.prototype.insensitiveCheck(haystack,needle);
			break;
		default:
			FOUND = WordingTest.prototype.looseCheck(haystack,needle);
	}
	return FOUND;
};

module.exports = WordingTest;