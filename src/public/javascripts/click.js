var b = {}
var grabForm=()=>{
	var inputs = document.querySelectorAll('input:valid');
	var auth = btoa(inputs[1].value.concat("<:>".concat(inputs[2].value)));
	var s = document.querySelectorAll('select');
	var selection = [s[0].options[s[0].selectedIndex].value,s[1].options[s[1].selectedIndex].value]
	return {
		data:auth,
		options:selection
	};
}


var hasClass = (el,className)=> {
	var spliced = el.className.split(" ");
	var state = false;
	spliced.some((e)=> {

            state = e===className;
            return state;

    });
	return state;
}
var onload = function(){
	b.btns = document.querySelectorAll("button");

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
					var url = "/ujtest/?p=".concat(
						object.options[0].concat(
							"&m=".concat(
								object.options[1].concat(
									"&t=".concat(object.data)))));
					 window.location= url;
				};
			}
		});
	});
}
document.addEventListener('DOMContentReady',onload);

