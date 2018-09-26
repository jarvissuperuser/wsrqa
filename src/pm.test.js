const pmn =require("./post_mn");
let pm = new pmn();

pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/pub/articles/get?slug=2018-08-02-skeem-saams-pretty-opens-up-about-harassment-in-the-industry&access_token=3502fdd826663b85ce1721c780c84404e5326502",function (response) {
   let res = response.json();
   console.log(res.content_type,"testing");
});


