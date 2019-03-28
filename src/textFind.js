const { JSDOM }= require("jsdom");



let unescaper = (htmlString)=>{
    return (new (new JSDOM(``,{runScripts:"dangerously"})).window.DOMParser)
        .parseFromString(htmlString,'text/html').querySelector("body").textContent.toString();
};
let specialCharacters = ["...",'\'','"','!',',',';','\n','\t','|',"  ","   "];

let textCleaner = (haystack,needle)=>{
    let new_haystack =  unescaper(haystack.toLowerCase());
    let new_needle = unescaper(needle.toLowerCase());
    specialCharacters.forEach(c=>{
       while(new_needle.indexOf(c)>-1||new_haystack.indexOf(c)>-1) {
           new_haystack = new_haystack.replace(c, "");
           new_needle = new_needle.replace(c, "");
       }
    });
    return {haystack:new_haystack,needle:new_needle};
};

let strictStrategy = (haystack, needle)=>{
    return haystack.indexOf(needle)>-1;
};

let insensitiveStrategy = (haystack, needle)=>{
    return haystack.toLowerCase().indexOf(needle.toLowerCase())>-1;
};

let looseStrategy = (haystack,needle)=>{
    let obj = textCleaner(haystack,needle);
    return insensitiveStrategy(obj.haystack,obj.needle);
};
module.exports = (haystack,needle,strategy = "STRICT")=>{
    let FOUND = false;
    switch (strategy.toLowerCase()) {
        case "s":
        case "strict":
            FOUND = strictStrategy(haystack,needle);
            break;
        case "i":
        case "insensitive":
        case "insens":
            FOUND = insensitiveStrategy(haystack,needle);
            break;
        default:
            FOUND = looseStrategy(haystack,needle);

    }
    return FOUND;
};