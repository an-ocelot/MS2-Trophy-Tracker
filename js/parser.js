function menu_click(x){

	while (bottom_scrollbar.firstChild) {
		bottom_scrollbar.removeChild(bottom_scrollbar.firstChild);
	}

	for (y in trophy_list[x]) {
		if (trophy_list[x][y].constructor === Object){

			var mini_div = document.createElement("div");
			mini_div.setAttribute("id", y);
			mini_div.setAttribute("class", "mini_tab");
			mini_div.setAttribute("onclick", "load_page(this.id)");
			mini_div.innerHTML = trophy_list[x][y].name;

			bottom_scrollbar.appendChild(mini_div);

		}
	}

	load_page(x);

}

var save_data = {

	data : {},

	load : function(){

		JSON.parse(localStorage.getItem("progress")) === null ? (this.data = empty_progress) : (this.data = JSON.parse(localStorage.getItem("progress")));

	},
	
	save : function(){

		localStorage.setItem("progress", JSON.stringify(this.data));
		console.log(this.data);

	}

}

function load_page(x){

	save_data.load();

	while (page.firstChild) {
		page.removeChild(page.firstChild);
	}

	switch (x){
		case 'world_boss_kills':
		case 'elite_boss_kills':
			for (y in save_data.data[x]){
				var cell_top = document.createElement("div");
				cell_top.innerHTML = trophy_list[x][y].name;
				page.appendChild(cell_top);
				var cell_bot = document.createElement("div");
				cell_bot.innerHTML = save_data.data[x][y];
				page.appendChild(cell_bot);
			}
			break;
	}
}

window.onload = function(){

	var bottom_scrollbar = document.getElementById("bottom_scrollbar");
	var page = document.getElementById("page");

	for (x in trophy_list) {

		var div = document.createElement("div");
		div.setAttribute("id", x);
		div.setAttribute("class", "main_tab");
		div.setAttribute("onclick", "menu_click(this.id)");
		div.innerHTML = trophy_list[x].name;

		document.getElementById("top_scrollbar").appendChild(div);

	};

}
