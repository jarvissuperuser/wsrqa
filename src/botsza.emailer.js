const PM = require("./post_mn");
let pm = new PM();
let copy1 = [],copy2 = [], copy3=[], mixed=[];
( async function main() {
    await pm.sendRequest("https://hazie-wl-api.eu-gb.mybluemix.net/api/user/list/with-email/",
	    function (response) {
            const res_data = JSON.parse( response.resp );
            console.log("\x1b[34m\n",
                        "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                        " |       emailer Hazie wl List                     |\n" +
                        " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
                try {
                    res_data.qualified.forEach((r)=>{
                        copy1.push(r.email);
                    });
                    res_data.unqualified.forEach(r => {
                        copy2.push(r.user);
                        mixed.push(r);
                    })

                }catch (e) {
                    console.log( e);
                }
            },{
                method:"GET",
                headers: {
                    Authorization: 'Token 42408c59e7030462b1f4e82ae98f5944ab3d9e26',
                    'Content-Type': 'application/json'
                }
        }
    );
    await pm.sendRequest("http://localhost:8000/api/user/score/",
	    function (response) {
            const res_data =  (response.resp );
            console.log("\x1b[34m\n",
                        "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                        " |       emailer Hazie  Test     |\n" +
                        " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
                try {
                    console.log("\x1b[35m",res_data.passed ,"\x1b[0m"); 
                    res_data.meta.forEach((r)=>{
                        if (r.score.indexOf('100.0%')>=0 ){
                            copy1.push(mixed.filter(e => e.user === r.user)[0].email);
                        }
                    });
                    console.log("\x1b[31m",copy2.slice(0,10),"\x1b[0m ");
                }catch (e) {
                    console.log(res_data , e);
                }
            },{
                method:"POST",
                headers: {
                    Authorization: 'Token 42408c59e7030462b1f4e82ae98f5944ab3d9e26'
                },
                json: copy2
        }
    );
    copy1.push('timothy@botsza.com');
    copy1.push('harmony@botsza.com');
    for(let a = 100; a < copy1.length; a+=50) {
        let batch1 = copy1.slice(0+a,50+a);
        await pm.sendRequest("http://localhost:8000/api/email/shortlist/",
            function (response) {
                const res_data =  (response.resp );
                console.log("\x1b[34m\n",
                            "+++++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                            " |       emailer Hazie  Emailer                    |\n" +
                            " +++++++++++++++++++++++++++++++++++++++++++++++++++","\x1b[0m");
                    try {
                        console.log(res_data); 
                    }catch (e) {
                        console.log(res_data , e);
                    }
                },{
                    method:"POST",
                    headers: {
                        Authorization: 'Token 42408c59e7030462b1f4e82ae98f5944ab3d9e26'
                    },
                    json: batch1
            }
        );

    }
    
})();



