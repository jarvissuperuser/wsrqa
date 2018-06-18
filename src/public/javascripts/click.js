let b = {
    testCases:[/timeslive+/g,/businesslive+/g,/wanted+/g,/sowetanlive+/g,/heraldlive+/g,
    /tl_home+/g,/bl_home/g,/w_home+/g,/sl_home+/g,/hl_home+/g],
    projectSet:["tl_home/","bl_home/","w_home/","sl_home/","hl_home/","tl_article/"],
	projectNames:["timeslive","businesslive","wanted","sowetanlive","heraldlive","test"]
}
var grabForm=()=>
{
	var inputs = document.querySelectorAll('input:valid');
	var auth = btoa(inputs[1].value.concat("<:>".concat(inputs[2].value.concat("<:>".concat(inputs[0].value)))));
	var s = document.querySelectorAll('select');
	var selection = [s[0].options[s[0].selectedIndex].value,s[1].options[s[1].selectedIndex].value];
	return {
		data:encodeURI(auth),
		options:selection
	};
}
var onError = (e)=>{
	console.log(e);
	var img = e.target;
	var path = img.src.split('/');
	path.reverse();
	var imgname = path[0];
	path.reverse();
	path.pop();
    path.pop();
    path.push(imgname);
    if (!getProject(imgname))
		img.src = (path.join('/'));
}

var TargetOnCLick= (target,val) =>{
	var ajax = new XMLHttpRequest();
	ajax.addEventListener("load",()=>{
		if (ajax.readyState === 4 && ajax.status === 200){
			renderCompareImages(target,ajax.responseText);
			ajax.removeEventListener("load",this);
		}
	});
	ajax.open("GET","/search?target="+val);
	ajax.send();
}

var renderCompareImages = (target,data) =>{
	var targetElement = b.targetElement;
	var dataRender = JSON.parse(data);
	console.log(targetElement);
	targetElement.innerHTML = "";
	dataRender.forEach(el=>{
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

var getProject = (image) =>{
    var x = 0;
    var dirPath = "";
    b.testCases.forEach((rgx)=>{
    	rgx.lastIndex = 0;
        if (rgx.test(image)){
            dirPath = b.projectSet[x%5];
        }
        x=x+1;
    });
    return dirPath;
}

var imageOnClick = (e)=>{
	var img = e.target;
	var modal = document.querySelector(".w3-modal");
	var modalImage = document.querySelector(".w3-modal img");
	modalImage.src = img.src;
	modal.style.display = "block";
}
var hideModal = (e)=>{
	b.modal.style.display = "none";
}

var hideBtnList = () => {
	var buttonContainer = document.querySelector(".w3-show");
	buttonContainer.classList.remove("w3-show");
}

var btnCreate= (str,target)=>{
	var btnString = "";
	var jsonObj = JSON.parse(str);
	b.targetElement = document.querySelector(target);
	jsonObj.forEach(k=>{
		btnString+="<button class='w3-btn w3-bar-item' onclick='TargetOnCLick(\""+
			+ target + "\"," +k.k+")'>"+
			k.n+"  ON Date:  "+ k.t +" ".concat('</button>');
	});
	return btnString;
}
/**
 * @deprecated
 * */
var hasClass = (el,className)=> {
	var spliced = el.className.split(" ");
	var state = false;
	spliced.some((e)=> {
            state = e===className;
            return state;
    });
	return state;
}

var x_encode=(srlzd)=>{
	let urlEncodedDataPairs = [];
	let urlEncodedData = "";
	for(name in srlzd) {
		urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(srlzd[name]));
	  }
	  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
	  return urlEncodedData;
}

var serialize = (form,obj) =>{
	let els = form.childNodes
	els.forEach((el) =>{
		if (el.name)
			obj[el.name] = [el.value];
	});
	return obj;
}

var mysubmit = function(e) {
	e.preventDefault();
	// console.log(e.target);
	let el = e.target;
	let obj = serialize(el,{});
	obj['submit'] = 'add_case_report'
	var data = x_encode(obj);
	// console.log(data);
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			console.log(this.responseText);
		}
	});
	xhr.open("POST", "http://localhost:3000/quality/add");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

var onload = function(){
    b.btns = document.querySelectorAll("button");
    b.images = document.querySelectorAll("img");
    b.modalBtn = document.querySelectorAll("span.w3-btn");
    b.modal = document.querySelector(".w3-modal");
    b.searchInput = document.querySelectorAll("input.search");
    b.ajax  = new XMLHttpRequest();
    b.targetElement = document.querySelector('.r1');

	b.btns.forEach((btn)=>{
		btn.addEventListener('click',(e)=>{
			var id;
			if (e.target){
				id = e.target.id;
			}
			if (id){
				var did = id.split('_')[1];
				window.location = "/record/?test=" + did;
			}else {
				if (hasClass(e.target,'ujtest')){
					var object = grabForm();
					var url = "/ujtest/?pr=".concat(
						object.options[0].concat(
							"&mt=".concat(
								object.options[1].concat(
									"&ts=".concat(object.data)))));
					var ajax = new XMLHttpRequest();
					ajax.onreadystatechange = () =>
					{
						if (ajax.readyState == 4 && ajax.status == 200)
							document.querySelector('#log_card').innerHTML
								+= "<p>".concat(ajax.responseText.concat('</p>'));
						else if (ajax.status == 500){
							document.querySelector('#log_card').innerHTML
								+= "<p>".concat("something Broke 500".concat('</p>'));
						}
                        ajax.onreadystatechange = () => {};
					}
					ajax.open("GET",url);
					ajax.send();
				}else if (hasClass(e.target,'add-case')){
					b.modal.style.display = 'block';

				}
			}
		});
	});
	b.searchInput.forEach(input=>{
		input.addEventListener("keyup",e=>{
			if (e.target.value.length >=3) {
				e.target.nextElementSibling.classList.add("w3-show");
				var ajax= b.ajax;
		    ajax.onload = () => {
		        if (ajax.readyState == 4 && ajax.status == 200)
		            input.nextElementSibling.innerHTML
		                = btnCreate(ajax.responseText,e.target.getAttribute("target"));
		        else if (ajax.status == 500) {
		            document.querySelector('#log_card').innerHTML
		                += "<p>".concat("something Broke 500".concat('</p>'));
		        }
                ajax.onload = () => {};
		    }
		    ajax.open("GET","/search?test="+e.target.value);
		    ajax.send();
			}else
			    input.nextSibling.classList.remove("w3-show");
			console.log(e.target.value);
		});
	});

	b.images.forEach(img=>{
		img.addEventListener("error",onError);
		img.addEventListener("click",imageOnClick);
	});
    b.modalBtn.forEach(btn=>{
        btn.addEventListener("click",hideModal);
    });
}
document.addEventListener('DOMContentReady',onload);

