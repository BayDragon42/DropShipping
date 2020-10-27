import messages from "./messages.js"

function keepAlive() {
	sendRequest(messages.SESSION_KEEP_ALIVE_REQUEST, {
		token: localStorage.getItem("x-access-token")
	});
}

function sendRequest(msg, payload) {
	console.log(msg);
	return $.ajax({
		type: "POST",
		url: "req",
		contentType: "application/json",
		data: JSON.stringify({
			msg: msg,
			payload: payload
		})
	})
	.then(response => {
		return JSON.parse(response);
	});
}

function getPage(url) {
	return $.ajax({
		type: "GET",
		url: url,
		contentType: "text/html",
		headers: {
			xPjax: true
		}
	})
	.then(response => {
		return response;
	});
}

function pageTransition(oldContent, newContent, callback) {	
	$(oldContent).fadeOut(200, function() {
		$(oldContent).remove();
		$(newContent).insertAfter("#header");
		callback();
		$(newContent).fadeIn(200);
	})
}

function changePage(callback) {
	const url = window.location.href;
	
	$("#menu").removeClass("nav-open");
	$("#header").children("div").children(".nav-button").removeClass("open");
	
	loadPage(url).then(response => {				
		var newContent = document.createElement("div");
		newContent.id = "content";
		newContent.style.display = "none";
		newContent.innerHTML = response;
		
		var oldContent = document.querySelector("#content");
		
		pageTransition(oldContent, newContent, function() {
			callback();
		});
	});
}

function loadPage(url) {	
	return new Promise((resolve, reject) => {
		resolve(getPage(url));
	});
}

function initCustomSelects() {
	// Custom select Style
	var x, i, j, l, ll, selElmnt, a, b, c;
	/*look for any elements with the class "custom-select":*/
	x = document.getElementsByClassName("custom-select");
	l = x.length;

	for (i = 0; i < l; i++) {
		if(x[i].getElementsByTagName("select")[0].options.length != 0) {
			$(x[i]).children("div").remove();
		
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
				if(selElmnt.options[j].disabled) {
					c.classList.add("disabled");
				}
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
				e.stopPropagation();
				if($(this).next("div.select-items:visible").length != 0) {
					$(this).next("div.select-items").slideUp(100, function() {
						$(window).off("click");
					});
				} else {
					var t = this;
					$("div.select-items").slideUp(100);
					$(this).next("div.select-items").slideDown(100, function() {
						window.addEventListener("click", function() {
							$(t).next("div.select-items").slideUp(100, function() {
								$(window).off("click");
							});
						});
					});
				}
			});
		}
	}
}

function fillLocaleValues(locale) {
	switch(document.location.pathname) {
		case "/":
			$(document).attr("title", locale["documentTitleIndex_core"]);
			break;
	
		default:
			$(document).attr("title", locale["documentTitleManage_core"]);
			break;
	}

	$("#Stats").children("span").html(locale["MMenuStats_core"]);
	$("#Visits").children("span").html(locale["MMenuVisits_core"]);
	$("#Commands").children("span").html(locale["MMenuCommands_core"]);
	$("#StatsProducts").children("span").html(locale["MMenuProductsVisits_core"]);
	$("#Products").children("span").html(locale["MMenuProducts_core"]);
	$("#Users").children("span").html(locale["MMenuUsers_core"]);
	$("#Config").children("span").html(locale["MMenuConfig_core"]);
	$("#ConfigProductsCat").children("span").html(locale["MMenuProductsCat_core"]);
	$("#ConfigProducts").children("span").html(locale["MMenuProducts_core"]);
	$("#ConfigLocale").children("span").html(locale["MMenuConfigLocFiles_core"]);
	$("#Infos").children("span").html(locale["FooterInfos_core"]);
	$("#QuickLinks").children("span").html(locale["FooterQuickLinks_core"]);

	$("#newLocFile").attr("placeholder", locale["MNewLocFile_core"]);
	$('[name="add"]').html(locale["MAdd_core"]);
	$('[name="update"]').html(locale["MUpdateKeyVal_core"]);
}

function initSubMenus() {
	$("ul.subMenu").hide();

	$("div.toggleSubMenu").click(function() {
		if($(this).children("ul.subMenu:visible").length != 0) {
			$(this).children("ul.subMenu").slideUp("normal");
		} else {
			$("div.toggleSubMenu").children("ul.subMenu").slideUp("normal");
			$(this).children("ul.subMenu").slideDown("normal");
		}
	});
}

function initMenuLinks(callback) {	
	// Init manage menu links
	$("#Stats").click(function() {
		//window.location.href = "/manage?page=stats";
	});
	$("#Visits").click(function() {
		history.pushState(null, null, "/manage?page=visits");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=visits";
	});
	$("#Commands").click(function() {
		history.pushState(null, null, "/manage?page=commands");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=commands";
	});
	$("#StatsProducts").click(function() {
		history.pushState(null, null, "/manage?page=visitedProducts");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=visitedProducts";
	});
	$("#Products").click(function() {
		history.pushState(null, null, "/manage?page=products");
		changePage("/manage?page=products");
		callback();
		//window.location.href = "/manage?page=products";
	});
	$("#Users").click(function() {
		history.pushState(null, null, "/manage?page=users");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=users";
	});
	$("#ConfigProductsCat").click(function() {
		history.pushState(null, null, "/manage?page=productsCategories");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=productsCategories";
	});
	$("#ConfigProducts").click(function() {
		history.pushState(null, null, "/manage?page=productsConfig");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=productsConfig";
	});
	$("#ConfigLocale").click(function() {
		history.pushState(null, null, "/manage?page=localeConfig");
		changePage(function() {
			callback();
		});
		//window.location.href = "/manage?page=localeConfig";
	});
}

function classTransform(target, from, to, time, ease) {
	var targetProp = [];
	$(target).parent().attr("class", to);
	$(target).each((k, item) => {
		var prop = {
			obj: item
		};
		getProp(prop);
		
		targetProp.push(prop);
	});
	var contentHeight = $("#content").height();
	
	$(target).parent().attr("class", from);
	
	$("#content").css("height", $("#content").height());
	$(target).parent().css({
		"position": "absolute",
		top: -parseInt($(target).parent().css("marginBottom")),
		left: -parseInt($(target).parent().css("marginLeft"))
	});
	var elemCount = 1;
	$(target).each((k, item) => {
		var currentProp = {
			obj: item
		};
		
		getProp(currentProp);
		
		setTimeout(function() {
			setProp(currentProp, 1);
			
			var tl = new TimelineMax({
				onComplete: function() {
					if(elemCount == $(target).length) {
						$(target).parent().find("*").removeAttr("style");
						$(item).parent().attr("class", to);
						$(target).parent().removeAttr("style");
						$("#content").removeAttr("style");
					}
					elemCount += 1;
				}
			});
			tl.add("children", "0");
			
			addTween(tl, null, targetProp[k], currentProp, time);
			
			// add Tween for #content
			tl.add(TweenLite.fromTo($("#content"), time, {
				height: $("#content").height()
			}, {
				height: contentHeight,
			}), "children");
		}, 1);
	});
}

function getProp(obj) {
	obj.left = $(obj.obj).offset().left - ($(obj.obj).outerWidth() - $(obj.obj).innerWidth());
	obj.top = $(obj.obj).offset().top - ($(obj.obj).outerHeight() - $(obj.obj).innerHeight());
	obj.width = $(obj.obj).width();
	obj.height = $(obj.obj).height();
	obj.children = [];
	
	$(obj.obj).children().each((k, item) => {
		obj.children.push({
			obj: item
		});
		getProp(obj.children[k]);
	});
}

function setProp(obj, zIndex, isChild) {
	if(isChild) {
		$(obj.obj).css({
			position: "absolute",
			left: obj.left - $(obj.obj).parent().offset().left,
			top: obj.top - $(obj.obj).parent().offset().top,
			width: obj.width,
			height: obj.height,
			zIndex: zIndex
		});
	} else {
		$(obj.obj).css({
			position: "absolute",
			left: obj.left - parseInt($(obj.obj).css("marginLeft")),
			top: obj.top - parseInt($(obj.obj).css("marginTop")),
			width: obj.width,
			height: obj.height,
			zIndex: zIndex
		});
	}
	
	$(obj.obj).children().each((k, item) => {
		setProp(obj.children[k], zIndex++, true);
	});
}

function addTween(tl, parent, obj, currentProp, time, isChild) {
	TweenLite.set(obj.obj, {
		x: 0,
		y: 0
	});
	if(isChild) {
		tl.add(TweenLite.fromTo(obj.obj, time, {
			left: currentProp.left - $(obj.obj).parent().offset().left,
			top: currentProp.top - $(obj.obj).parent().offset().top,
			width: currentProp.width,
			height: currentProp.height
		}, {
			left: obj.left - parent.left,
			top: obj.top - parent.top,
			width: obj.width,
			height: obj.height
		}), "children");
	} else {
		console.log(parseInt($(obj.obj).parent().css("marginTop")));
		tl.add(TweenLite.fromTo(obj.obj, time, {
			left: currentProp.left - parseInt($(obj.obj).css("marginLeft")),
			top: currentProp.top - parseInt($(obj.obj).css("marginTop")),
			width: currentProp.width,
			height: currentProp.height
		}, {
			left: obj.left - parseInt($(obj.obj).css("marginLeft")),
			top: obj.top - (parseInt($(obj.obj).parent().css("paddingTop")) + parseInt($(obj.obj).parent().css("paddingBottom"))),
			width: obj.width,
			height: obj.height
		}), "children");
	}
	
	obj.children.forEach((item, k) => {
		addTween(tl, obj, item, currentProp.children[k], time, true);
	});
}

export default {
	keepAlive: function() {
		keepAlive();
	},
	getLocale: function(loc, home) {
		return new Promise((resolve, reject) => {
			resolve(sendRequest(messages.GET_LOCALE_CONTENT_REQUEST, {
				pth: loc,
				home: home
			}));
		})
	},
	sendRequest: function(msg, payload) {
		return new Promise((resolve, reject) => {
			resolve(sendRequest(msg, payload));
		})
	},
	fillLocaleValues: function(locale) {
		fillLocaleValues(locale);
	},
	initCustomSelects: function() {
		initCustomSelects();
	},
	initSubMenus: initSubMenus(),
	initMenuLinks: function(callback) {
		initMenuLinks(function() {
			callback();
		})
	},
	classTransform: function(target, from, to, time, ease) {
		classTransform(target, from, to, time, ease);
	},
	changePage: function(callback) {
		changePage(callback);
	}
};
