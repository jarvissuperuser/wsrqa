const CFG = require('./setup');
const PM = require('./post_mn');

let config = new CFG();
let pm = new PM();
config.init('app.ini');
config.env = 'live';
let p = 'sl';
let pub = ['sowetan-live','sundaytimes'];
let section = ['home','news','business'];
let feature_list = "/apiv1/workflow/get-all";
(async function main() {
    pm.sendRequest(config.get_url(p)+feature_list,function (r) {
      if(Array.isArray(r.resp)){
          r.resp.forEach(({article})=>{
              console.log(article.title);
          });
      }
    },
        {
            method:'post',
            json:{
                status:'featured',
                publication: pub[0],
                section:section[0],
            }
        });
})();