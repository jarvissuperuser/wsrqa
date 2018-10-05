const pmn =require("./post_mn");
let pm = new pmn();
let authorisation = "3502fdd826663b85ce1721c780c84404e5326502";
async function tests() {
    await pm.sendRequest("http://tl-st-staging.appspot.com/apiv1/pub/articles/get?slug=2018-08-02-skeem-saams-pretty-opens-up-about-harassment-in-the-industry&access_token=0",function (response) {
        let res = response.json();
        let status = response.status();
        let header  = response.getHeader('server');
        console.log(res.slug, ":",":",header);
    });
    pm.test("is Premium", async function () {
        await pm.expect(pm.response.json().content_type).to.equal("premium");
    });
    pm.test("content is not viewable",async function () {
       let content = pm.response.json().plain_text;
        await pm.expect(content).to.equal("~ No Access ~");
    });
}

tests();