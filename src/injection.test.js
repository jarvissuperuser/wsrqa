// let require = require || {};
const injectionmiddleware = require("./middleware/injectionengine");
const CFG = require("./setup");
const fs = require("fs-extra");
const UJ = require("./userjourney");
const PM = require("./post_mn");


let setup = new CFG();
let u = new UJ();
let p = '*';
let fileName = `${p==='*'?'all':p}.result.json`;
// let fileNameCurrent = ;
let pm = new PM();



let hasProp = (path = [],obj={})=>{
 let o = obj;
 let found = true;
 return path.every(e=>{
  found = o.hasOwnProperty(e);
  // console.log("has prop",e,found,path);
  o = o.hasOwnProperty(e)?o[e]:undefined;
  return found;
 });
};
let getProp = (path = [],obj = {}) =>{
 let o = obj;
 let found = true;
 path.every(e=>{
  found = o.hasOwnProperty(e);
  o = o.hasOwnProperty(e)?o[e]:undefined;
  return found;
 });
 return o;
};
let read = (filename) => {
 return fs.readJsonSync(filename);
};
let write = (filename,data) => {
 console.log(filename,'written');
 fs.writeJsonSync(filename,data);
};
let compare = (d1 = {}, d2 = {}) => {
 let result = {};
 let path = [];

 try {
  for (let data in d1) {
   console.log(`data >> ${data}`);
    let infoLevel1 = d1[data];

    for (let inner1  in  infoLevel1){
     if (inner1 === 'section')
     console.log(`\tinner 1 >> ${inner1}`);
      infoLevel1[inner1].forEach((e,i)=>{
       if(e[data]){
         e[data].forEach(async (element,index)=>{
           path.push(data);path.push(inner1);path.push(i);path.push(data);path.push(index);
           if (hasProp(path,d2)) {
            result[data] = result[data]?result[data]:{};
            result[data][element.section] = result[data][element.section]?result[data][element.section]:{};
            console.log("\t\td2>>", d2[data][inner1][i][data][index].file);
            console.log("\t\td1>>", d1[data][inner1][i][data][index].file);
            u.diff_img = `${data}.${d2[data][inner1][i][data][index].section}.${u.timestamp}.diff.png`;
            console.log('\t\tdiff>>',u.diff_img,element.section);
            //await u.runDiff(d1[data][inner1][i][data][index].file,d2[data][inner1][i][data][index].file);
            result[data][element.section].f1 = d1[data][inner1][i][data][index].file;
            result[data][element.section].f2 = d2[data][inner1][i][data][index].file;
            result[data][element.section].diff = u.diff_img;
           }
           path = [];
         });
       }
      });

     if (inner1 === 'sportlive') {
      console.log(`\tinner 1 >> ${inner1}`,'infoLevel1[inner1][0]');
      infoLevel1[inner1][0].forEach((element,index)=>{
       path.push(data);path.push(inner1);path.push(0);path.push(index);
       if(hasProp(path,d2)) {
        result[data] = result[data] ? result[data] : {};
        result[data][element.league] = result[data][element.league]?result[data][element.league]:{};
        let obj2 = getProp(path,d2);
        let obj1 = getProp(path,d1);
        console.log("\t\td2>>", obj2.file);
        console.log("\t\td1>>", obj1.file);
        u.diff_img = `${data}.${obj2.league}.${u.timestamp}.diff.png`;
        console.log('\t\tdiff>>',u.diff_img,element.league);
        //await u.runDiff(d1[data][inner1][i][data][index].file,d2[data][inner1][i][data][index].file);
        result[data][element.league].f1 = obj1.file;
        result[data][element.league].f2 = obj2.file;
        result[data][element.league].diff = u.diff_img;
       }
       path = []
      });
     }

     //FIXME
     if (inner1 === 'crossword' && data ==='st') {
      console.log(`\tinner 1 >> ${inner1}`, 'infoLevel1[inner1][0]');
      for(let element in infoLevel1[inner1][0]){
       // console.log(element," count");
       path.push(data);path.push(inner1);path.push(0);path.push(element);
       // console.log(element," count", hasProp(path,d2));
       if(hasProp(path,d2)) {
        result[data] = result[data] ? result[data] : {};
        result[data][element] = result[data][element]?result[data][element]:{};
        let obj2 = getProp(path,d2);
        let obj1 = getProp(path,d1);
        console.log("\t\td2>>", obj2.file);
        console.log("\t\td1>>", obj1.file);
        u.diff_img = `${data}.${element}.${u.timestamp}.diff.png`;
        console.log('\t\tdiff>>',u.diff_img,"crosswords");
        result[data][element].f1 = obj1.file;
        result[data][element].f2 = obj2.file;
        result[data][element].diff = u.diff_img;
       }
       path = []
      }// * */
     }
     if (inner1 === 'login') {
      console.log(`\tinner 1 >> ${inner1}`,'infoLevel1[inner1]');
      for(let element in infoLevel1[inner1][0]){
       path.push(data);path.push(inner1);path.push(0);path.push(element)
       //console.log(element);
       if(hasProp(path,d2)) {
        result[data] = result[data] ? result[data] : {};
        result[data][element] = result[data][element]?result[data][element]:{};
        let obj2 = getProp(path,d2);
        let obj1 = getProp(path,d1);
        console.log("\t\td1>>", obj1.file);
        console.log("\t\td2>>", obj2.file);
        u.diff_img = `${data}.${element}.${u.timestamp}.diff.png`;
        console.log('\t\tdiff>>',u.diff_img);
        result[data][element].f1 = obj1.file;
        result[data][element].f2 = obj2.file;
        result[data][element].diff = u.diff_img;
       }
       path = []
      }//*/
    }

   }

  }
 }
 catch (e) {
  console.log(e.message , ">> error");
 }
 return result;
};

let diff = async (com)=>{
 for (let pub in com){
   for (let aspect in com[pub]){
     u.diff_img = com[pub][aspect].diff;
     console.log(com[pub][aspect].diff,pub);
     let img = await u.runDiff(com[pub][aspect].f1, com[pub][aspect].f2).catch(e => console.log(e.message));
     if (img !== "neglegible difference"){
      await pm.sendRequest("https://hooks.slack.com/services/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",function (r) {
        console.log("SentMessage>> ",r.resp);
       },{method:"POST",json:{
         text:`Pub:${pub} SECTION:${aspect} \nDIFF: ${img} \nIMG0: ${com[pub][aspect].f1} \nIMG1:${com[pub][aspect].f2}`
        }});
     }
   }
  }//*/
};

(async function main() {
 /**
 * Mock input
 * */
 let res = await injectionmiddleware(p,"*","no");//pubQuery
 let fileExists = await fs.pathExists(fileName);
 if (fileExists) {
  //compare
  let latest = read(fileName);

  let com = compare(latest,res);
  await diff(com);
  write(`${p==='*'?'all':p}.${u.timestamp}.json`,res);


 } else {
  //save file
  write(fileName,res);
 }
 //console.log(JSON.stringify(res));
})();
