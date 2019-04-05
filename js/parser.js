window.onload = function(){

	var bottom_scrollbar = document.getElementById("bottom_scrollbar");

	function menu_click(x) {

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

				document.getElementById("bottom_scrollbar").appendChild(mini_div);

			}
		}

		load_page(x);

	};

	for (x in trophy_list) {

		var div = document.createElement("div");
		div.setAttribute("id", x);
		div.setAttribute("class", "main_tab");
		div.setAttribute("onclick", "menu_click(this.id)");
		div.innerHTML = trophy_list[x].name;

		document.getElementById("top_scrollbar").appendChild(div);

	};

};
