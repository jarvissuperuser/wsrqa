let b = {
    testCases: [/timeslive+/g, /businesslive+/g, /wanted+/g, /sowetanlive+/g, /heraldlive+/g,
        /tl_home+/g, /bl_home/g, /w_home+/g, /sl_home+/g, /hl_home+/g],
    projectSet: ["tl_home/", "bl_home/", "w_home/", "sl_home/", "hl_home/", "tl_article/"],
    projectNames: ["timeslive", "businesslive", "wanted", "sowetanlive", "heraldlive", "test"]
}
let grabForm = () => {
    let inputs = document.querySelectorAll('input:valid');
    let auth = btoa(inputs[1].value.concat("<:>".concat(inputs[2].value.concat("<:>".concat(inputs[0].value)))));
    let s = document.querySelectorAll('select');
    let selection = [s[0].options[s[0].selectedIndex].value, s[1].options[s[1].selectedIndex].value];
    return {
        data: encodeURI(auth),
        options: selection
    };
}
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
}

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
}

let renderCompareImages = (target, data) => {
    let targetElement = b.targetElement;
    let dataRender = JSON.parse(data);
    console.log(targetElement);
    targetElement.innerHTML = "";
    dataRender.forEach(el => {
        let src = `/images/${getProject(el.log_image)}${el.log_image}`;
        let oc = `onclick="imageOnClick(event)"`;
        let alt = `alt="${el.log_image}"`;
        let cl = "class='w3-col s12 l6'";
        let cli = `class='w3-col s12 l12'`;
        let divO = `<div ${cl}><p>${el.log_info}</p>`;
        let img = `<img src="${src}" ${alt} ${oc} ${cli} />`;
        targetElement.innerHTML += `${divO}${img}</div>`;
    });
    hideBtnList();

}

let getProject = (image) => {
    let x = 0;
    let dirPath = "";
    b.testCases.forEach((rgx) => {
        rgx.lastIndex = 0;
        if (rgx.test(image)) {
            dirPath = b.projectSet[x % 5];
        }
        x = x + 1;
    });
    return dirPath;
}

let imageOnClick = (e) => {
    let img = e.target;
    let modal = document.querySelector(".w3-modal");
    let modalImage = document.querySelector(".w3-modal img");
    modalImage.src = img.src;
    modal.style.display = "block";
}
let hideModal = (e) => {
    b.modal.style.display = "none";
}

let hideBtnList = () => {
    let buttonContainer = document.querySelector(".w3-show");
    buttonContainer.classList.remove("w3-show");
}

let btnCreate = (str, target) => {
    let btnString = "";
    let jsonObj = JSON.parse(str);
    b.targetElement = document.querySelector(target);
    jsonObj.forEach(k => {
        btnString += "<button class='w3-btn w3-bar-item' onclick='TargetOnCLick(\"" +
            +target + "\"," + k.k + ")'>" +
            k.n + "  ON Date:  " + k.t + " ".concat('</button>');
    });
    return btnString;
}
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
}

let x_encode = (srlzd) => {
    let urlEncodedDataPairs = [];
    let urlEncodedData = "";
    for (let name in srlzd) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(srlzd[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    return urlEncodedData;
}

let serialize = (form, obj) => {
    let els = form.childNodes
    els.forEach((el) => {
        if (el.name)
            obj[el.name] = [el.value];
    });
    return obj;
}

let mysubmit = function (e) {
    e.preventDefault();
    let el = e.target;
    let obj = serialize(el, {});
    obj['submit'] = 'add_case_reg';
    let data = x_encode(obj);
    let config = {
        method:"POST",
        endPoint:"http://localhost:3000/quality/add",
        header:
            [{
                header:"Content-Type",
                value:"application/x-www-form-urlencoded"
            }],
        data:data
    }; console.log(config);
    ajax(config,function () {
        if (this.readyState == 4 && this.status == 200)
            if (JSON.parse(this.responseText)[0] !== 1){
                location = "/quality/qa";
                alert(this.responseText);
            }
    })

};

let ajax = (config,callBk)=>{
    b.ajax = new XMLHttpRequest();
    b.ajax.onreadystatechange = callBk;
    b.ajax.open(config.method,config.endPoint);
    if (config.header)
        config.header.forEach((h)=>{
            b.ajax.setRequestHeader(h.header,h.value);
        });
    b.ajax.send(config.data);
};

let onload = function () {
    b.btns = document.querySelectorAll("button");
    b.images = document.querySelectorAll("img");
    b.modalBtn = document.querySelectorAll("span.w3-btn");
    b.modal = document.querySelector(".w3-modal");
    b.searchInput = document.querySelectorAll("input.search");
    b.ajax = new XMLHttpRequest();
    b.targetElement = document.querySelector('.r1');

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
                    let ajax = b.ajax;
                    ajax.onreadystatechange = () => {
                        if (ajax.readyState == 4 && ajax.status == 200)
                            document.querySelector('#log_card').innerHTML
                                += "<p>".concat(ajax.responseText.concat('</p>'));
                        else if (ajax.status == 500) {
                            document.querySelector('#log_card').innerHTML
                                += "<p>".concat("something Broke 500".concat('</p>'));
                        }
                        ajax.onreadystatechange = () => {
                        };
                    }
                    ajax.open("GET", url);
                    ajax.send();
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
                    if (ajax.readyState == 4 && ajax.status == 200)
                        input.nextElementSibling.innerHTML
                            = btnCreate(ajax.responseText, e.target.getAttribute("target"));
                    else if (ajax.status == 500) {
                        document.querySelector('#log_card').innerHTML
                            += "<p>".concat("something Broke 500".concat('</p>'));
                    }
                    ajax.onload = () => {
                    };
                }
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
}
document.addEventListener('DOMContentReady', onload);

