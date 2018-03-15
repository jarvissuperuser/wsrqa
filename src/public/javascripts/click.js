var b = {}
var onload = function(){
	b.btns = document.querySelectorAll("button");

	b.btns.forEach((btn)=>{
		btn.addEventListener('click',(e)=>{
			var id;
			if (e.target){
				id = e.target.id
			}
			if (id){
				var did = id.split('_')[1];
				window.location = "./record/?test=" + did;
			}
		});
	});
}
document.addEventListener('DOMContentReady',onload);

