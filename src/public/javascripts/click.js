let b = {
    testCases: [/timeslive+/g, /businesslive+/g, /wanted+/g, /sowetanlive+/g, /heraldlive+/g,
        /tl_home+/g, /bl_home/g, /w_home+/g, /sl_home+/g, /hl_home+/g],
    projectSet: ["tl/", "bl/", "w/", "sl/", "hl/", "tl/"],
    projectNames: ["timeslive", "businesslive", "wanted", "sowetanlive", "heraldlive", "test"],
    tableHideList:[1,2]
};
let grabForm = () => {
    let inputs = document.querySelectorAll('input:valid');
    let auth = btoa(inputs[1].value.concat("<:>".concat(inputs[2].value.concat("<:>".concat(inputs[0].value)))));
    let s = document.querySelectorAll('select');
    let selection = [s[0].options[s[0].selectedIndex].value, s[1].options[s[1].selectedIndex].value];
    return {
        data: encodeURI(auth),
        options: selection
    };
};
let onError = (e) => {
    console.log(e);
    let img = e.target;
    let path = img.src.split('/');
    path.reverse();
    let imgname = path[0];
    path.reverse();
    path.pop();
    path.pop();
    path.push(imgname);
    if (!getProject(imgname))
        img.src = (path.join('/'));
};

let TargetOnCLick = (target, val) => {
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", () => {
        if (ajax.readyState === 4 && ajax.status === 200) {
            renderCompareImages(target, ajax.responseText);
            ajax.removeEventListener("load", this);
        }
    });
    ajax.open("GET", "/search?target=" + val);
    ajax.send();
};

let renderCompareImages = (target, data) => {
    let targetElement = b.targetElement;
    let dataRender = JSON.parse(data);
    console.log(targetElement);
    targetElement.innerHTML = "";
    dataRender.forEach(el => {
        let src = getProject(el.n);
        let oc = `onclick="imageOnClick(event)"`;
        let alt = `alt="${el.t}"`;
        let cl = "class='w3-col s12 l12'";
        let cli = "class='w3-col s12 l12'";
        let divO = `<div ${cl}><p>${el.t}</p>`;
        let img = `<img src="${src}" ${alt} ${oc} ${cli} />`;
        targetElement.innerHTML += `${divO}${img}</div>`;
    });
    hideBtnList();

};

let getProject = (image) => {
    let x = 0;
    let dirPath = "";
    let im;
    if(image.indexOf('public')<0){
        b.testCases.forEach((rgx) => {
            rgx.lastIndex = 0;
            if (rgx.test(image)) {
                dirPath = b.projectSet[x % 5];
            }
            x = x + 1;
        });
    } else{
        let p_ele = image.split('/');
        p_ele.reverse();
        p_ele.pop();
        p_ele.pop();
        p_ele.reverse();
        im = p_ele.join('/');
    }
    return dirPath?`/images/${dirPath}/${image}`:`/${im}`;
};

let imageOnClick = (e) => {
    let img = e.target;
    let modal = document.querySelector(".w3-modal");
    let modalImage = document.querySelector(".w3-modal img");
    modalImage.src = img.src;
    modal.style.display = "block";
};
let hideModal = (e) => {
    b.modal.style.display = "none";
};

let hideBtnList = () => {
    let buttonContainer = document.querySelector(".w3-show");
    buttonContainer.classList.remove("w3-show");
};
/**
 * URL/compare/
 * */
let btnCreate = (str, target) => {
    let btnString = "";
    let jsonObj = JSON.parse(str);
    b.targetElement = document.querySelector(target);
    jsonObj.forEach(k => {
        const t_ = k.n.split('/').reverse()[0].split('.')[0];
        btnString += "<button class='w3-btn w3-bar-item' onclick='TargetOnCLick(\"" +
            +target + "\"," + k.k + ")'>" +
            t_ + "  Details:  " + k.t + " ".concat('</button>');
    });
    return btnString;
};
/**
 * @deprecated
 * */
let hasClass = (el, className) => {
    let spliced = el.className.split(" ");
    let state = false;
    spliced.some((e) => {
        state = e === className;
        return state;
    });
    return state;
};

let x_encode = (srlzd) => {
    let urlEncodedDataPairs = [];
    let urlEncodedData = "";
    for (let name in srlzd) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(srlzd[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    return urlEncodedData;
};

let serialize = (form, obj) => {
    let els = form.querySelectorAll("input,select,textarea");
    els.forEach((el) => {
        if (el.name)
            obj[el.name] = [el.value];
    });
    return obj;
};

let mysubmit = function (e) {
    e.preventDefault();
    console.log("mysubmit");
    let el = e.target;
    let obj = serialize(el, {});
    obj['submit'] = hasClass(el,"case-add")?'add_case':'add_case_reg';
    if (b.projectId)
        obj['id'] = b.projectId;
    let data = x_encode(obj);
    let config = {
        method:"POST",
        endPoint:"/quality/add",
        header:
            [{
                header:"Content-Type",
                value:"application/x-www-form-urlencoded"
            }],
        data:data
    }; console.log(config);
    ajax(config,function () {
        if (this.readyState == 4 && this.status == 200)
            if (!JSON.parse(this.responseText)[0]){
                location = "/quality/qa#" + (b.projectId?b.projectId:JSON.parse(this.responseText)['data']);
                if (obj['submit']  ==="add_case"){table_fetch();hideModal()}
            } else {
                console.log(JSON.parse(this.responseText)[0]);
            }

    });

};

let actionSubmit = (e) => {
    // console.log("actionSubmit");
    let el = e.target;
    let obj = serialize(el, {});
    // obj['submit'] = hasClass(el,"case-add")?'add_case':'add_case_reg';
    if (b.projectId)
        obj['id'] = b.projectId;
    let data = x_encode(obj);
    let config = {
        method:"POST",
        endPoint:"/dev/actions",
        header:
            [{
                header:"Content-Type",
                value:"application/x-www-form-urlencoded"
            }],
        data:data
    };
    // console.log(config.endPoint);
    ajax(config,function () {
        if (this.readyState === 4 && this.status === 200)
            if (!JSON.parse(this.responseText)[0]){
                // location = "/quality/qa#" + (b.projectId?b.projectId:JSON.parse(this.responseText)['data']);
                // if (obj['submit']  ==="add_case"){table_fetch();hideModal()}
            } else {
                //console.log(JSON.parse(this.responseText)[0]);
                document.querySelector("textarea").value = this.responseText;
            }
    });
};

let ajax = (config,callBk)=>{
    b.ajax = b.ajax || new XMLHttpRequest();
    b.ajax.onreadystatechange = callBk;
    console.log(config.endPoint,"ajax");
    b.ajax.open(config.method,config.endPoint);
    if (config.header)
        config.header.forEach((h)=>{
            b.ajax.setRequestHeader(h.header,h.value);
        });
    b.ajax.send(config.data);
};
function valueProcessor(str,key){
    switch(key){
        case "uid":
            return str?str:"students number";
        case "pass_fail":
            return str?(str ==='t'?'&check;':'&times;'):"pass_fail";
        case "profile":
            return str?str.name + " " + str.surname :"name";
        default:
            return str?str:key;
    }
}

function hideCell(num){
    var a = false;
    b.tableHideList.some(function(entry,key){
        a = entry === num;
        return  a;
    });
    return a;
}
function show_modal() {
    b.modal.style.display = 'block';
}
function td_click(e) {
   let val = e.target.parentNode.querySelector(":nth-child(1)").innerText;
   console.log(val);
}
let table_data_render= function(){
    let vp = b.view_port.getAttribute('vp');
};
let table_fetch = function () {
    let data = {
        submit:"get_case_reg",
        case_reg_id:b.projectId
    };
    let datastr = x_encode(data);
    let config = {
        method:"POST",
        endPoint:"/quality/add",
        header:
            [{
                header:"Content-Type",
                value:"application/x-www-form-urlencoded"
            }],
        data:datastr
    };
    ajax(config,table_load);

};
let table_load = function () {
    if(this.readyState === 4&&this.status === 200){
        let data = JSON.parse(this.responseText);
        tableCreate(data,1);
    }
};

function tableCreate(data,depth){
    let table = document.createElement("table");
    table.className = "w3-display-middle w3-col "+
        "l12 s12 w3-center w3-content w3-animate-opacity w3-black";
    let header = table.createTHead();
    let caption = table.createCaption();
    let button = document.createElement("button");
    button.className = "w3-display-topright w3-circle w3-green add-case w3-button w3-ripple w3-small";
    button.innerHTML = "&plus;";
    button.setAttribute("onclick","show_modal()");
    caption.innerHTML= button.outerHTML;
    if (data){

        // table.style = "text-align:center";
        let rowCount = 0;
        let row = header.insertRow(0);
        for(let key in data[0]){
            let cell = row.insertCell(rowCount++);
            cell.innerHTML = valueProcessor(undefined,key).toUpperCase().bold();
            cell.style.padding = "10px 30px 10px ";
            if (hideCell(rowCount)){
                cell.classList.add("w3-hide-small");
            }
        }
        data.forEach(function(entry,key){
            row  = table.insertRow(key+1);
            let rowExtract = data[key];
            let count = 0;
            for(let p in rowExtract){
                let cell = row.insertCell(count++);
                cell.innerHTML = valueProcessor(rowExtract[p],p);
                cell.setAttribute("onclick","td_click(event)");
                if (hideCell(count)){
                    cell.classList.add("w3-hide-small");
                }
            }
        });
        table.style.borderSpacing = 0;
        table.style.whiteSpace = "normal";
        document.querySelector("table.w3-display-middle").outerHTML = "";
        document.querySelector("div.w3-container").innerHTML += table.outerHTML;
        // table.querySelectorAll("td").forEach((td)=>{td.setAttribute("onclick","td_click(event)");});
    }
}

let onload = function () {
    b.btns = document.querySelectorAll("button");
    b.images = document.querySelectorAll("img");
    b.modalBtn = document.querySelectorAll("span.w3-btn");
    b.modal = document.querySelector(".w3-modal");
    b.searchInput = document.querySelectorAll("input.search");
    b.subFormInputs = document.querySelectorAll("form div.w3-container input.l6");
    b.subFormInputs = document.querySelectorAll("form div.w3-container input.l5");
    b.ajax = new XMLHttpRequest();
    b.targetElement = document.querySelector('.r1');
    b.projectId = location.hash.substr(1);

    b.btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let id;
            if (e.target) {
                id = e.target.id;
            }
            if (id) {
                let did = id.split('_')[1];
                window.location = "/record/?test=" + did;
            } else {
                if (hasClass(e.target, 'ujtest')) {
                    let object = grabForm();
                    let url = "/ujtest/?pr=".concat(
                        object.options[0].concat(
                            "&mt=".concat(
                                object.options[1].concat(
                                    "&ts=".concat(object.data)))));
                    let config = {
                        method:"GET",
                        endPoint:url,
                        data:""
                    };
                    let onreadystatechange = function(){
                        if (this.readyState == 4 && this.status == 200){
                            document.querySelector('#log_card').innerHTML
                                += "<p>".concat(ajax.responseText.concat('</p>'));
                            this.onreadystatechange = () => {
                            };
                        }
                        else if (this.status == 500) {
                            document.querySelector('#log_card').innerHTML
                                += "<p>".concat("something Broke 500".concat('</p>'));
                            this.onreadystatechange = () => {
                            };
                        }

                    };
                    ajax(config,onreadystatechange);
                } else if (hasClass(e.target, 'add-case')) {
                    b.modal.style.display = 'block';
                }
            }
        });
    });
    b.searchInput.forEach(input => {
        input.addEventListener("keyup", e => {
            if (e.target.value.length >= 3) {
                e.target.nextElementSibling.classList.add("w3-show");
                let ajax = b.ajax;
                ajax.onload = () => {
                    if (ajax.readyState == 4 && ajax.status == 200) {
                        input.nextElementSibling.innerHTML
                            = btnCreate(ajax.responseText, e.target.getAttribute("target"));
                        ajax.onload = () => {
                        };
                    }
                    else if (ajax.status == 500) {
                        document.querySelector('#log_card').innerHTML
                            += "<p>".concat("something Broke 500".concat('</p>'));
                        ajax.onload = () => {
                        };
                    }

                };
                ajax.open("GET", "/search?test=" + e.target.value);
                ajax.send();
            } else
                input.nextSibling.classList.remove("w3-show");
            console.log(e.target.value);
        });
    });

    b.images.forEach(img => {
        img.addEventListener("error", onError);
        img.addEventListener("click", imageOnClick);
    });
    b.modalBtn.forEach(btn => {
        btn.addEventListener("click", hideModal);
    });
    b.view_port =(document.querySelector('view-port'));
    if (b.view_port && location.href.indexOf('quality')>=0)table_fetch();
};
document.addEventListener('DOMContentLoaded', onload);

