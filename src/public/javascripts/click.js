var b = {}
document.onload = function(){
	var b.btns = document.querySelectorAll("button");

	b.btns.forEach((btn)=>{
		btn.addEventListener('click',(e)=>{
			var id;
			if (e.target){
				id = e.target.id
			}
			if (id){
				var did = id.split('_')[1];
				window.location = "./users/?test=" + did;
			}
		});
	});
}
