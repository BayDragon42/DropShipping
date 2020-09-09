import messages from "./messages.js"

import {l} from "./locale.js";

var loc = localStorage.getItem("locale");
if(loc === null) {
	localStorage.setItem("locale", "fr");
}

function fillLocaleValues(locale) {
	switch(document.location.pathname) {
		case "/index":
			$(document).attr("title", locale["documentTitleIndex"]);
			break;
		
		default:
			$(document).attr("title", locale["documentTitleManage"]);
			break;
	}
	
	$("#Stats").children("span").html(locale["MMenuStats"]);
	$("#Visits").children("span").html(locale["MMenuVisits"]);
	$("#Commands").children("span").html(locale["MMenuCommands"]);
	$("#StatsProducts").children("span").html(locale["MMenuProductsVisits"]);
	$("#Products").children("span").html(locale["MMenuProducts"]);
	$("#Users").children("span").html(locale["MMenuUsers"]);
	$("#Config").children("span").html(locale["MMenuConfig"]);
	$("#ConfigProducts").children("span").html(locale["MMenuProducts"]);
	$("#ConfigLocale").children("span").html(locale["MMenuConfigLocFiles"]);
	$("#Infos").children("span").html(locale["FooterInfos"]);
	$("#QuickLinks").children("span").html(locale["FooterQuickLinks"]);
	
	$("#newLocFile").attr("placeholder", locale["MNewLocFile"]);
	$("#addLocFile").html(locale["MAddLocFile"]);
}

function initCustomSelects() {
	// Custom select Style
	var x, i, j, l, ll, selElmnt, a, b, c;
	/*look for any elements with the class "custom-select":*/
	x = document.getElementsByClassName("custom-select");
	l = x.length;
	
	for (i = 0; i < l; i++) {
		selElmnt = x[i].getElementsByTagName("select")[0];
		ll = selElmnt.length;
		
		/*for each element, create a new DIV that will act as the selected item:*/
		a = document.createElement("div");
		a.setAttribute("class", "select-selected");
		a.innerHTML = "<span>" + selElmnt.options[selElmnt.selectedIndex].innerHTML + "</span>";
		a.innerHTML += '<img src="./src/img/fleche.png">';
		x[i].appendChild(a);
		
		/*for each element, create a new DIV that will contain the option list:*/
		b = document.createElement("div");
		b.setAttribute("class", "select-items select-hide");
		
		for (j = 0; j < ll; j++) {
			/*for each option in the original select element,
			create a new DIV that will act as an option item:*/
			c = document.createElement("div");
			c.innerHTML = selElmnt.options[j].innerHTML;
			c.addEventListener("click", function(e) {
				/*when an item is clicked, update the original select box,
				and the selected item:*/
				var y, i, k, s, h, sl, yl;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				
				for (i = 0; i < sl; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = "<span>" + this.innerHTML + "</span>";
						h.innerHTML += '<img src="./src/img/fleche.png">';
						y = this.parentNode.getElementsByClassName("same-as-selected");
						yl = y.length;
						for (k = 0; k < yl; k++) {
							y[k].removeAttribute("class");
						}
						this.setAttribute("class", "same-as-selected");
						break;
					}
				}
				h.click();
			});
			b.appendChild(c);
		}
		x[i].appendChild(b);
		
		a.addEventListener("click", function(e) {
			if($(this).next("div.select-items:visible").length != 0) {
				$(this).next("div.select-items").slideUp(100);
			} else {
				$("div.select-selected div.select-items").slideUp(100);
				$(this).next("div.select-items").slideDown(100);
			}
		});
	}
}

function initCommonElements() {
	initCustomSelects();
	
	// Init manage menu links
	$("#Stats").click(function() {
		window.location.href = "/manage?page=stats";
	});
	$("#Visits").click(function() {
		window.location.href = "/manage?page=visits";
	});
	$("#Commands").click(function() {
		window.location.href = "/manage?page=commands";
	});
	$("#StatsProducts").click(function() {
		window.location.href = "/manage?page=productsstats";
	});
	$("#Products").click(function() {
		window.location.href = "/manage?page=products";
	});
	$("#Users").click(function() {
		window.location.href = "/manage?page=users";
	});
	$("#ConfigProducts").click(function() {
		window.location.href = "/manage?page=productsconfig";
	});
	$("#ConfigLocale").click(function() {
		window.location.href = "/manage?page=locale";
	});
}

function keepAlive() {
	var token = localStorage.getItem("x-access-token");
	
	if(token != null) {
		$.ajax({
			type: "POST",
			url: "req",
			contentType: "application/json",
			data: JSON.stringify({
				msg: messages.SESSION_KEEP_ALIVE_REQUEST,
				payload : {
					token: token
				}
			})
		})
		.done((data) => {
			data = JSON.parse(data);
		
			if(data.msg !== messages.SESSION_KEEP_ALIVE_SUCCESS) {
				localStorage.removeItem("x-access-token");
			}
		});
	}
}
	
//Manage's login
$("#login").click(function() {
	var userId = $("#userId").val();
	var password = $("#password").val();
	$.ajax({
		type: "POST",
		url: "req",
		contentType: "application/json",
		data: JSON.stringify({
			msg: messages.LOGIN_REQUEST,
			payload: {
				session: "/manage",
				credentials: {
					user_id: userId,
					pass: password
				}
			}
		})
	})
	.done((data) => {
		data = JSON.parse(data);
		
		if(data.msg === messages.LOGIN_SUCCESS) {
			localStorage.setItem("x-access-token", data.payload.token);
		
			window.location.href = "/manage?page=stats";
		} else if(data.msg === messages.LOGIN_USERNAME_ERROR) {
			console.log("Username doesn't exists");
		} else if(data.msg === messages.LOGIN_PASSWORD_ERROR) {
			console.log("Password is wrong");
		}
	})
	.fail((data) => {
		console.err("failed");
	});
});

$(document).ready(function() {	
	setInterval(keepAlive(), 1000*60*9 + 1000*55);
	
	l()
	.then(response => {
		var locale = response.payload.content;
		fillLocaleValues(locale);
		
		$("body").on("click", ".select-items", function() {
			$("#keyList").empty();
	
			$.ajax({
				type: "POST",
				url: "req",
				contentType: "application/json",
				data: JSON.stringify({
					msg: messages.GET_FILE_CONTENT_REQUEST,
					payload: {
						pth:"localisation/" + $("#lang").val()
					}
				})
			})
			.done((data) => {
				data = JSON.parse(data);
		
				if(data.msg === messages.GET_FILE_CONTENT_SUCCESS) {
					$.each(data.payload.content, function(k, v) {
						var elem_node = document.createElement("div");
						elem_node.classList.add("element");
	
						var col_node = document.createElement("div");
	
						var key_node = document.createElement("span");
						key_node.innerHTML = k;
				
						var button = document.createElement("button");
						button.name = "keyUpdate";
						button.innerHTML = locale["MUpdateKeyVal"];
				
						$(col_node).append(key_node);
						$(col_node).append(button);
				
						var textarea_node = document.createElement("textarea");
						textarea_node.name = "keyText";
						textarea_node.value = v;
				
						$(elem_node).append(col_node);
						$(elem_node).append(textarea_node);
				
						$("#keyList").append(elem_node);
					});
				}
			});
		});
	});
	
	$("ul.subMenu").hide();
	
	$("div.toggleSubMenu").click(function() {
		if($(this).children("ul.subMenu:visible").length != 0) {
			$(this).children("ul.subMenu").slideUp("normal");
		} else {
			$("div.toggleSubMenu ul.subMenu").slideUp("normal");
			$(this).children("ul.subMenu").slideDown("normal");
		}
	});
	
	// Gets loc files
	$.ajax({
		type: "POST",
		url: "req",
		contentType: "application/json",
		data: JSON.stringify({
			msg: messages.GET_FILES_FROM_PATH_REQUEST,
			payload: {
				dir: "localisation"
			}
		})
	})
	.done((data) => {
		data = JSON.parse(data);
		if(data.msg === messages.GET_FILES_FROM_PATH_SUCCESS) {
			var files = data.payload.files;
			
			$.each(files, function(k, v) {
				var option = document.createElement("option");
				option.value = v
				option.innerHTML = v;
				
				document.getElementById("lang").append(option);
			});
			
			initCustomSelects();
		}
	});
	
	initCommonElements();
});
