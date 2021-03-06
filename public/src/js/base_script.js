import common from './common_script.js'
import messages from "./messages.js"

var keepAliveInterval;

$("body").hide();

function getScript(locale, callback) {
	$("#cart > div:last-child").hide();
	$("#log > div:last-child").hide();
	$("#content").empty();
	
	updateCartVisual(true, null, null, function() {
		var path = window.location.pathname + window.location.search;
		switch(true) {
			// CASE OF PRODUCT
			case /\/products\?p=.*/.test(path):
				pageConfig(locale["MMenuProducts_core"], 1);
				
				// TODO: Enhance the search value spliting (more security control)
			
				common.sendRequest(messages.GET_PRODUCT_DATA_REQUEST, {
					filter: "",
					loc: localStorage.getItem("locale"),
					id: window.location.search.split("=")[1]
				})
				.then(response => {
					if(response.msg === messages.GET_PRODUCT_DATA_SUCCESS) {
						var product = response.payload.products[0];
						var originalImg = {};
					
						pageConfig(decodeURIComponent(product.title), 1);
						var productInfo_node = document.createElement("div");
						productInfo_node.setAttribute("class", "row full Xmargin list");
					
						// Title
						var row_node = document.createElement("div");
						row_node.setAttribute("class", "row full sa Xmargin");
						row_node.innerHTML = decodeURIComponent(product.title);
					
						productInfo_node.appendChild(row_node);
					
						// Images and PInfo
						var row_node = document.createElement("div");
						row_node.setAttribute("class", "row full sa Xmargin");
					
						var imgContainer_node = document.createElement("div");
						imgContainer_node.classList.add("viewer");
					
						var miniImage_tl = new TimelineMax({
							repeat: -1
						});
						var miniImage_node = document.createElement("div");
						miniImage_node.classList.add("miniViewer");
						
						if(product.img != null) {
							product.img.forEach(item => {
								var image = document.createElement("img");
								image.src = item[0];
								image.addEventListener("click", function() {
									var t = this;
									$(this).parent().next().children("img").fadeOut(100, function() {
										$(this).attr("src", $(t).attr("src"));
										$(this).fadeIn(100);
									});
								});
						
								miniImage_node.appendChild(image);
							});
						}
					
						// Image Previsualisation
						var zoom = document.createElement("div");
						zoom.id = "zoom";
					
						var lens = document.createElement("div");
						lens.id = "lens";
					
						var scrollTime = $(miniImage_node).children.length * 10;
						var imageSelect_node = document.createElement("div");
						var image_node = document.createElement("div");
						var image = document.createElement("img");
						if(product.img == null) {
							image.src = "src/img/default.jpeg";
						} else {
							image.src = product.img.filter(x => x[1] == 1)[0][0];
							image.addEventListener("click", function() {
								var bigImg = $('.bigViewer').children('img');
						
								assignZoomImg(product.img.filter(x => x[1] == 1)[0][0], bigImg, zoom, function(result) {
									originalImg = result;
								});
						
								bigImg.attr("src", $(this).attr("src"));
								miniImage_tl.pause();
								$("body").find(".bigViewer").css("display", "flex").hide().fadeIn(100, function() {
									var bigImage_tl = new TimelineMax({
										repeat: -1
									})
									.to(imageSelect_node, scrollTime, {
										scrollLeft: imageSelect_node.scrollWidth - imageSelect_node.offsetWidth,
										ease: Power0.easeNone
									})
									.to(imageSelect_node, scrollTime, {
										scrollLeft: 0,
										ease: Power0.easeNone
									});
							
									imageSelect_node.addEventListener("touchstart", function() {
										bigImage_tl.pause();
									});
							
									imageSelect_node.addEventListener("mouseenter", function() {
										bigImage_tl.pause();
									});
							
									imageSelect_node.addEventListener("touchend", function() {
										bigImage_tl.resume(scrollTime * (imageSelect_node.scrollLeft / (imageSelect_node.scrollWidth - imageSelect_node.offsetWidth)));
									});
							
									imageSelect_node.addEventListener("mouseleave", function() {
										bigImage_tl.resume(scrollTime * (imageSelect_node.scrollLeft / (imageSelect_node.scrollWidth - imageSelect_node.offsetWidth)));
									});
								});
							});
						}
						image_node.appendChild(image);
					
						$(".bigViewer").remove();
						var bigImage_node = document.createElement("div");
						bigImage_node.classList.add("bigViewer");
					
						var bigImage = document.createElement("img");
						var zoomTm;
					
						lens.addEventListener("click", function(e) {
							$(this).parent().fadeOut(100, function() {
								miniImage_tl.resume();
							});
						});
					
						lens.addEventListener("mouseenter", function(e) {
							setZoomContainerPos(e, $(this).next("img"));
						
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeIn(75);
							}, 1);
						});
						zoom.addEventListener("mouseenter", function(e) {
							setZoomContainerPos(e, $(this).prev("img"));
						
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeIn(75);
							}, 1);
						});
						bigImage.addEventListener("mouseenter", function(e) {
							setZoomContainerPos(e, this);
						
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeIn(75);
							}, 1);
						});
					
						lens.addEventListener("mouseleave", function() {
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeOut(75);
							}, 1);
						});
						zoom.addEventListener("mouseleave", function() {
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeOut(75);
							}, 1);
						});
						bigImage.addEventListener("mouseleave", function() {
							clearTimeout(zoomTm);
							zoomTm = setTimeout(function() {
								$("#zoom").fadeOut(75);
							}, 1);
						});
					
						lens.addEventListener("mousemove", function(e) {
							e.prevent
							setZoomContainerPos(e, $(this).next("img"));
						
							moveLens(e, originalImg, bigImage, lens, zoom);
						})
						zoom.addEventListener("mousemove", function(e) {
							setZoomContainerPos(e, $(this).prev("img"));
						
							moveLens(e, originalImg, bigImage, lens, zoom);
						})
						bigImage.addEventListener("mousemove", function(e) {
							setZoomContainerPos(e, this);
						
							moveLens(e, originalImg, bigImage, lens, zoom);
						});
					
						lens.addEventListener("touchmove", function(e) {
							setZoomContainerPos(e, $(this).next("img"));
						
							moveLens(e, originalImg, bigImage, lens, zoom);
						});
						zoom.addEventListener("mousemove", function(e) {
							setZoomContainerPos(e, $(this).prev("img"));
						
							moveLens(e, originalImg, bigImage, lens, zoom);
						})
						bigImage.addEventListener("touchmove", function(e) {
							setZoomContainerPos(e, this);
												
							moveLens(e, originalImg, bigImage, lens, zoom);
						});
			
						window.addEventListener("resize", function() {
							initZoomingSize(originalImg, bigImage, zoom, lens);
						});
						
						if(product.img != null) {
							product.img.forEach(item => {
								var image = document.createElement("img");
								image.src = item[0];
								image.addEventListener("click", function(e) {
									var t = this;
									$(".bigViewer").children("img").fadeOut(100, function() {
										$(this).attr("src", $(t).attr("src"));
										assignZoomImg(product.img.filter(x => x[1] == 1)[0][0], $(bigImage), zoom, function(result) {
											originalImg = result;
										});
								
										$(this).fadeIn(100);
									});
							
									e.stopPropagation();
								});
						
								imageSelect_node.appendChild(image);
							});
						}
					
						bigImage_node.innerHTML = "<span>Click on the image to exit</span>";
						bigImage_node.appendChild(lens);
						bigImage_node.appendChild(bigImage);
						bigImage_node.appendChild(imageSelect_node);
						bigImage_node.appendChild(zoom);
						
						if(product.img != null) {
							imgContainer_node.appendChild(miniImage_node);
						}
						imgContainer_node.appendChild(image_node);
						$("#container").append(bigImage_node);
					
						// Info container
						var pInfo_node = document.createElement("div");
						pInfo_node.innerHTML = "Heya !!!!!!!!!!!!!!!!!!!!";
					
						row_node.appendChild(imgContainer_node);
						row_node.appendChild(pInfo_node);
					
						productInfo_node.appendChild(row_node);
					
						// Description
						var row_node = document.createElement("div");
						row_node.setAttribute("class", "row full sa Xmargin");
						row_node.innerHTML = decodeURIComponent(product.description);
					
						productInfo_node.appendChild(row_node);
					
						$("#content").append(productInfo_node);
					
						// init Tween animations
						miniImage_tl.to(miniImage_node, scrollTime, {
							scrollTop: miniImage_node.scrollHeight - miniImage_node.offsetHeight,
							ease: Power0.easeNone
						})
						.to(miniImage_node, scrollTime, {
							scrollTop: 0,
							ease: Power0.easeNone
						});
					
						miniImage_node.addEventListener("touchstart", function() {
							miniImage_tl.pause();
						});
					
						miniImage_node.addEventListener("mouseenter", function() {
							miniImage_tl.pause();
						});
					
						miniImage_node.addEventListener("touchend", function() {
							miniImage_tl.resume(scrollTime * (miniImage_node.scrollTop / (miniImage_node.scrollHeight - miniImage_node.offsetHeight)));
						});
					
						miniImage_node.addEventListener("mouseleave", function() {
							miniImage_tl.resume(scrollTime * (miniImage_node.scrollTop / (miniImage_node.scrollHeight - miniImage_node.offsetHeight)));
						});
					} else if(response.msg === messages.GET_PRODUCT_DATA_ERROR) {
						// No products found
					}
				})
				.then(response => {
					callback();
				});
				break;
		
			// CASE OF PRODUCTS
			case /\/products/.test(path):
				pageConfig(locale["MMenuProducts_core"], 1);
				var button = document.createElement("button");
				button.addEventListener("click", function() {
					if($("#list").hasClass("stk")) {
						common.classTransform(".sticker", "stk", "lst", 0.3);
					} else {
						common.classTransform(".sticker", "lst", "stk", 0.3);
					}
				});
			
				var productList_node = document.createElement("div");
				productList_node.id = "list";
				// Check local storage for disposition
				productList_node.setAttribute("class", "stk");
			
				common.sendRequest(messages.GET_PRODUCTS_SHORT_DATA_REQUEST, {
					filter: "",
					loc: localStorage.getItem("locale")
				})
				.then(response => {
					if(response.msg === messages.GET_PRODUCTS_SHORT_DATA_SUCCESS) {
						var products = response.payload.products;
						$(productList_node).empty();
						$.each(products, function(k, v) {
							var product_node = document.createElement("div");
							product_node.classList.add("sticker");
						
							var productImg_node = document.createElement("div");
							productImg_node.classList.add("clickable");
							// On click show product complete detail page
							productImg_node.addEventListener("click", function() {
								history.pushState(null, null, "/products?p=" + $(this).children("img").attr("name"));
								common.changePage(function() {
									getScript(locale);
								});
							});
							var img = document.createElement("img");
							img.name = v.id;
							
							if(v.img == null) {
								img.src = "src/img/default.jpeg";
							} else {
								img.src = v.img;
							}
						
							productImg_node.appendChild(img);
						
							var productInfo_node = document.createElement("div");
							productInfo_node.classList.add("clickable");
							// On click show product complete detail page
							productInfo_node.addEventListener("click", function() {
								history.pushState(null, null, "/products?p=" + $(this).prev().children("img").attr("name"));
								common.changePage(function() {
									getScript(locale);
								});
							});
						
							var title = document.createElement("span");
							title.innerHTML = decodeURIComponent(v.title);
							var description = document.createElement("span");
							description.innerHTML = decodeURIComponent(v.short_description);
							var buyOpt = document.createElement("div");
							buyOpt.addEventListener("click", function(e) {
								e.stopPropagation();
							});
							var amount = document.createElement("input");
							amount.type = "number";
							amount.min = 1;
							amount.value = 1;
						
							buyOpt.appendChild(amount);
						
							productInfo_node.appendChild(title);
							productInfo_node.appendChild(description);
							productInfo_node.appendChild(buyOpt);
						
							var productOpt_node = document.createElement("div");
							var price = document.createElement("div");
							price.innerHTML = v.price;
						
							var quickBuy = document.createElement("div");
							quickBuy.classList.add("clickable");
							var optTimeout;
							quickBuy.innerHTML = "Achat Rapide";
						
							var buy = document.createElement("div");
							buy.classList.add("clickable");
							buy.innerHTML = "J'achète";
							buy.addEventListener("touchend", function() {
								// Adds product to cart
								updateCart(v.id, parseInt(amount.value));
							});
						
							buy.addEventListener("mouseleave", function() {
								if($(this).parent().prev("div").children("div:visible").length !== 0) {
									var t = this
									optTimeout = setTimeout(function() {
										$(t).parent().prev("div").children("div").fadeOut(100);
										$(t).prev().css("display", "flex").hide().fadeIn(100);
										$(t).fadeOut(100);
									}, 1);
								}
							});
							buy.addEventListener("mouseenter", function() {
								clearTimeout(optTimeout);
							});
							// Click only for mobile devices
							quickBuy.addEventListener("touchend", function(e) {
								e.stopPropagation();
								$(this).parent().prev("div").children("div").css("display", "flex").hide().fadeIn(100);
								$(this).next().css("display", "flex").hide().fadeIn(100);
								$(this).fadeOut(100);
							});
							quickBuy.addEventListener("mouseenter", function() {
								$(this).parent().prev("div").children("div").css("display", "flex").hide().fadeIn(100);
								$(this).next().css("display", "flex").hide().fadeIn(100);
								$(this).fadeOut(100);
							});
							quickBuy.addEventListener("mousestart", function() {
								var t = this
								optTimeout = setTimeout(function() {
									$(t).parent().prev("div").children("div").fadeOut(100);
									$(t).css("display", "flex").hide().fadeIn(100);
									$(t).next().fadeOut(100);
								}, 1);
							});
							buyOpt.addEventListener("mouseleave", function() {
								if($(this).children(":visible").length !== 0) {
									var t = this
									optTimeout = setTimeout(function() {
										$(t).fadeOut(100);
										$(t).parent().next().children("div:nth-child(2)").css("display", "flex").hide().fadeIn(100);
										$(t).parent().next().children("div:nth-child(3)").fadeOut(100);
									}, 1);
								}
							});
							buyOpt.addEventListener("mouseenter", function() {
								clearTimeout(optTimeout);
							});
						
							productOpt_node.appendChild(price);
							productOpt_node.appendChild(quickBuy);
							productOpt_node.appendChild(buy);
						
							product_node.appendChild(productImg_node);
							product_node.appendChild(productInfo_node);
							product_node.appendChild(productOpt_node);
						
							productList_node.appendChild(product_node);
						});
					
						$("#content").append(button);
						$("#content").append(productList_node);
					
						return response;
					}
				})
				.then(response => {
					callback();
				});
				break;
			
			// CASE OF CART STEP 1 (PRODUCTS REVIEW)
			case /\/cart\?step=1/.test(path):
				$("#cart").off("touchend");
				$("#cart").off("mouseenter");
				$("#cart").off("mouseleave");
				
				var cart = JSON.parse(localStorage.getItem("cart"));
				
				var cartContentNode = document.createElement("div");
				cartContentNode.setAttribute("class", "cartList");
				$(cartContentNode).css({
					"max-height": "unset",
					"overflow-y": "unset"
				});
				
				$("#content").append(cartContentNode);
				
				var total = 0;
				let counter = 0;
				if(Object.entries(cart).length != 0) {
					for (const [key, value] of Object.entries(cart)) {
						common.sendRequest(messages.GET_PRODUCTS_SHORT_DATA_REQUEST, {
							filter: "",
							id: key,
							loc: localStorage.getItem("locale")
						})
						.then(response => {
							if(response.msg === messages.GET_PRODUCTS_SHORT_DATA_SUCCESS) {
								var product = response.payload.products[0];
							
								var productLink = document.createElement("a");
								productLink.setAttribute("data-id", product.id);
								productLink.href = "./products?p=" + product.id;
							
								var productImg = document.createElement("img");
								if(product.img == null) {
									productImg.src = "src/img/default.jpeg";
								} else {
									productImg.src = product.img;
								}
								productLink.appendChild(productImg);
							
								var productInfo = document.createElement("p");
								productInfo.setAttribute("class", "textOverflow");
								productInfo.innerHTML = decodeURIComponent(product.title);
								productLink.appendChild(productInfo);
							
								var productInfo = document.createElement("p");
								productInfo.setAttribute("class", "textOverflow");
								productInfo.setAttribute("quantity", "");
								productInfo.innerHTML = "Quantité : " + value;
								productLink.appendChild(productInfo);
							
								var productInfo = document.createElement("p");
								productInfo.setAttribute("class", "textOverflow");
								productInfo.innerHTML = "Prix unit. " + product.price;
								productLink.appendChild(productInfo);
							
								var productInfo = document.createElement("p");
								productInfo.setAttribute("class", "textOverflow");
								productInfo.innerHTML = "Tot. " + product.price * value;
								productLink.appendChild(productInfo);
							
								total += product.price * value;
							
								var productRemove = document.createElement("template-remove");
								productRemove.setAttribute("class", "cardButton");
								$(productRemove).attr({
									"weight": 0.0625,
									"size": 1.25,
									"color": "#333",
									"margin": 0.125
								});
								productRemove.addEventListener("click", function(e) {
									e.stopPropagation();
									var cart = JSON.parse(localStorage.getItem("cart"));
									delete cart[$(this).parent("a").attr("data-id")];
								
									localStorage.setItem("cart", JSON.stringify(cart));
									updateCartSticker(cart);
								
									$(this).parent("a").animate({
										height: 0,
										opacity: 0
									}, 250, function() {
										$(this).remove();
									});
								});
								productRemove.addEventListener("touchend", function(e) {
									e.stopPropagation();
									e.preventDefault();
								});
								productLink.appendChild(productRemove);
							
								cartContentNode.appendChild(productLink);
					
								counter++;
								if(counter == Object.keys(cart).length) {
									var summaryContainerNode = document.createElement("div");
									summaryContainerNode.setAttribute("class", "row full Xmargin list");
				
									var row = document.createElement("div");
									row.setAttribute("class", "row full sb Xmargin");
									var span = document.createElement("span");
									span.innerHTML = "Total:";
									row.appendChild(span);
									var span = document.createElement("span");
									span.innerHTML = total;
									row.appendChild(span);
									summaryContainerNode.appendChild(row);
				
									var row = document.createElement("div");
									row.setAttribute("class", "row full sb Xmargin");
									var span = document.createElement("span");
									span.innerHTML = "Total Frais:";
									row.appendChild(span);
									var span = document.createElement("span");
									span.innerHTML = 0;
									row.appendChild(span);
									summaryContainerNode.appendChild(row);
									
									var row = document.createElement("div");
									row.setAttribute("class", "row full sb Xmargin");
									var button = document.createElement("a");
									button.classList.add("button");
									button.href = "/";
									button.innerHTML = "Retour";
									row.appendChild(button);
									var button = document.createElement("a");
									button.classList.add("button");
									button.href = "/cart?step=2";
									button.innerHTML = "Suivant";
									row.appendChild(button);
									
									summaryContainerNode.appendChild(row);
									
									$("#content").append(summaryContainerNode);
									
									callback();
								}
							}
						});
					}
				} else {
					callback();
				}
				break;
			
			// CASE OF CART STEP 2 (ADDRESSES)
			case /\/cart\?step=2/.test(path):
				pageConfig("TBD", 1);
				
				localStorage.setItem("userAddrCart", "");
				
				var getUserAddresses;
				var useThisAddress = function(addr) {
					$("[name=userName]").html(`${addr.surname} ${addr.name}`);
					$("[name=addr]").html(addr.address);
					$("[name=npaTwn]").html(`${addr.npa} ${addr.town}`);
					$("[name=cnty]").html(addr.country);
					$("[name=ph]").html(addr.phone);
	
					localStorage.setItem("userAddrCart", JSON.stringify(addr));
				}
				var initAddressForm = function(t, addr) {
					var getFormAddress = function() {
						if(addr !== undefined) {
							common.sendRequest(messages.GET_USER_EMAIL_REQUEST, {
								token: common.getCookie("cx-access-token")
							})
							.then(response => {
								return {
									name: $("[name=name]").val(),
									surname: $("[name=surname]").val(),
									email: response.payload.email,
									address: $("[name=address]").val(),
									npa: $("[name=npa]").val(),
									town: $("[name=town]").val(),
									country: $("[name=country]").val(),
									phone: $("[name=phone]").val(),
									society: $("[name=society]").val() ? $("[name=society]").val() : null,
									floor: $("[name=floor]").val() ? $("[name=floor]").val() : null,
									batiment: $("[name=batiment]").val() ? $("[name=batiment]").val() : null,
									door_code1: $("[name=doorCode1]").val() ? $("[name=doorCode1]").val() : null,
									door_code2: $("[name=doorCode2]").val() ? $("[name=doorCode2]").val() : null,
									interphone: $("[name=interphone]").val() ? $("[name=interphone]").val() : null,
									instructions: $("[name=instructions]").val() ? $("[name=instructions]").val() : null
								}
							});
						} else {
							return {
								name: $("[name=name]").val(),
								surname: $("[name=surname]").val(),
								email: $("[name=email]").val(),
								address: $("[name=address]").val(),
								npa: $("[name=npa]").val(),
								town: $("[name=town]").val(),
								country: $("[name=country]").val(),
								phone: $("[name=phone]").val(),
								society: $("[name=society]").val() ? $("[name=society]").val() : null,
								floor: $("[name=floor]").val() ? $("[name=floor]").val() : null,
								batiment: $("[name=batiment]").val() ? $("[name=batiment]").val() : null,
								door_code1: $("[name=doorCode1]").val() ? $("[name=doorCode1]").val() : null,
								door_code2: $("[name=doorCode2]").val() ? $("[name=doorCode2]").val() : null,
								interphone: $("[name=interphone]").val() ? $("[name=interphone]").val() : null,
								instructions: $("[name=instructions]").val() ? $("[name=instructions]").val() : null
							}
						}
					}
					
					var addressesContainer = document.createElement("div");
					$(addressesContainer).attr("class", "col full Xmargin");
					
					if(addr !== undefined) {
						var addrListHeader = document.createElement("div");
						$(addrListHeader).attr("class", "sb Omargin");
					
						var addrRemove = document.createElement("template-back");
						addrRemove.setAttribute("class", "cardButton");
						$(addrRemove).attr({
							"weight": 0.0625,
							"size": 1.25,
							"color": "#333",
							"margin": 0.125,
							"angle": 80
						});
						addrRemove.addEventListener("click", function() {
							getUserAddresses();
						});
						addrListHeader.appendChild(addrRemove);
					
						var addrRemove = document.createElement("template-remove");
						addrRemove.setAttribute("class", "cardButton");
						$(addrRemove).attr({
							"weight": 0.0625,
							"size": 1.25,
							"color": "#333",
							"margin": 0.125
						});
						addrRemove.addEventListener("click", function() {
							$(this).parents("[class='row Xmargin vCardContainer']").fadeOut(100);
						});
						addrListHeader.appendChild(addrRemove);
						
						addressesContainer.appendChild(addrListHeader);
					}
					
					var input = document.createElement("input");
					input.placeholder = "nom";
					input.value = (addr != null) ? addr.name : "" || "";
					input.name = "name";
					addressesContainer.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "prenom";
					input.value = (addr != null) ? addr.surname : "" || "";
					input.name = "surname";
					addressesContainer.append(input);
					
					if(addr === undefined) {
						var input = document.createElement("input");
						input.placeholder = "e-mail";
						input.name = "email";
						addressesContainer.append(input);
					}
					
					var input = document.createElement("input");
					input.placeholder = "addresse";
					input.value = (addr != null) ? addr.address : "" || "";
					input.name = "address";
					addressesContainer.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "npa";
					input.value = (addr != null) ? addr.npa : "" || "";
					input.name = "npa";
					addressesContainer.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "ville";
					input.value = (addr != null) ? addr.town : "" || "";
					input.name = "town";
					addressesContainer.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "pays";
					input.value = (addr != null) ? addr.country : "" || "";
					input.name = "country";
					addressesContainer.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "tel.";
					input.value = (addr != null) ? addr.phone : "" || "";
					input.name = "phone";
					addressesContainer.append(input);
					
					var compInfo;
					// Info complement
					var moreInfo = document.createElement("a");
					moreInfo.innerHTML = "plus d'infos";
					moreInfo.addEventListener("click", function() {
						$(compInfo).slideToggle(100);
					});
					addressesContainer.append(moreInfo);
					
					compInfo = document.createElement("div");
					$(compInfo).attr("class", "col full Xmargin");
					$(compInfo).hide();
					
					var input = document.createElement("input");
					input.placeholder = "societe";
					input.value = (addr != null) ? addr.society : "" || "";
					input.name = "society";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "etage";
					input.value = (addr != null) ? addr.floor : "" || "";
					input.name = "floor";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "bat.";
					input.value = (addr != null) ? addr.batiment : "" || "";
					input.name = "batiment";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "interphone";
					input.value = (addr != null) ? addr.interphone : "" || "";
					input.name = "interphone";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "code porte";
					input.value = (addr != null) ? addr.door_code1 : "" || "";
					input.name = "doorCode1";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "code porte 2";
					input.value = (addr != null) ? addr.door_code2 : "" || "";
					input.name = "doorCode2";
					compInfo.append(input);
					
					var input = document.createElement("input");
					input.placeholder = "instructions";
					input.value = (addr != null) ? addr.instructions : "" || "";
					input.name = "instructions";
					compInfo.append(input);
					
					addressesContainer.appendChild(compInfo);
					
					if(addr !== undefined) {
						var addLink = document.createElement("a");
						$(addLink).attr("class", "button");
						addLink.addEventListener("click", function() {
							if(addr != null) {
								// Updates address
								common.sendRequest(messages.UPDATE_ADDRESS_REQUEST, {
									id: addr.id,
									address: getFormAddress()
								})
								.then(response => {
									if(response.msg === messages.UPDATE_ADDRESS_SUCCESS) {
										getUserAddresses();
										useThisAddress(getFormAddress());
									}
								});
							} else {
								// Adds new address
								common.sendRequest(messages.ADD_ADDRESS_REQUEST, {
									token: common.getCookie("cx-access-token"),
									address: getFormAddress()
								})
								.then(response => {
									if(response.msg === messages.ADD_ADDRESS_SUCCESS) {
										getUserAddresses();
										useThisAddress(getFormAddress());
									}
								});
							}
						});
						addLink.innerHTML = "a"
						addressesContainer.append(addLink);
					} else {
						var row = document.createElement("div");
						row.setAttribute("class", "row full sb Xmargin");
						var button = document.createElement("a");
						button.classList.add("button");
						button.href = "/cart?step=1";
						button.innerHTML = "Retour";
						row.appendChild(button);
						var button = document.createElement("a");
						button.classList.add("button");
						button.addEventListener("click", function(e) {
							localStorage.setItem("userAddrCart", JSON.stringify(getFormAddress()));
						});
						button.href = "/cart?step=3";
						button.innerHTML = "Suivant";
						row.appendChild(button);
						
						addressesContainer.append(row);
					}
					
					t.append(addressesContainer);
				}
				
				if(common.getCookie("cx-access-token")) {
					var addressList = document.createElement("div");
					addressList.id = "addrList";
					$(addressList).attr("class", "row full Xmargin vCardContainer");
					
					$("#content").append(addressList);
		
					$(addressList).hide();
					
					// Retrieves saved addresses
					common.sendRequest(messages.GET_LAST_USED_ADDRESS_REQUEST, {
						token: common.getCookie("cx-access-token")
					})
					.then(response => {
						if(response.msg === messages.GET_LAST_USED_ADDRESS_SUCCESS) {
							var address = response.payload.address;
							
							localStorage.setItem("userAddrCart", JSON.stringify(address));
							
							getUserAddresses = function() {
								common.sendRequest(messages.GET_USER_ADDRESSES_REQUEST, {
									token: common.getCookie("cx-access-token")
								})
								.then(response => {
									if(response.msg === messages.GET_USER_ADDRESSES_SUCCESS) {
										var addresses = response.payload.addresses;
										
										$(addressList).empty();
										
										var addressesContainer = document.createElement("div");
										$(addressesContainer).attr("class", "col full");
										
										var addrListHeader = document.createElement("div");
										$(addrListHeader).attr("class", "align-right full");
										
										var addrRemove = document.createElement("template-remove");
										addrRemove.setAttribute("class", "cardButton");
										$(addrRemove).attr({
											"weight": 0.0625,
											"size": 1.25,
											"color": "#333",
											"margin": 0.125
										});
										addrRemove.addEventListener("click", function() {
											$(this).parents("[class*=vCardContainer]").fadeOut(100);
										});
										addrListHeader.appendChild(addrRemove);
										addressesContainer.appendChild(addrListHeader);
										
										var cardContainer = document.createElement("div");
										$(cardContainer).attr("class", "row full Xmargin list");
							
										addresses.forEach(item => {
											var visitCard = document.createElement("div");
											visitCard.addEventListener("click", function() {
												// Use this address
												useThisAddress(item);
									
												$(this).parents("[class*=vCardContainer]").fadeOut(100, function() {
													// Updates last used address
													common.sendRequest(messages.UPDATE_LAST_USED_ADDRESS_REQUEST, {
														id: item.id
													});
												});
											});
											if(item.last_used == response.payload.last.last_used) {
												$(visitCard).attr("class", "col full visitCard vcActive");
											} else {
												$(visitCard).attr("class", "col full visitCard");
											}
											
											var header = document.createElement("div");
											header.setAttribute("class", "align-right full");
											
											var addrRemove = document.createElement("template-remove");
											addrRemove.addEventListener("click", function(e) {
												e.stopPropagation();
												// Deletes address
												common.sendRequest(messages.DELETE_ADDRESS_REQUEST, {
													address_id: item.id
												})
												.then(response => {
													if(response.msg === messages.DELETE_ADDRESS_SUCCESS) {
														$(this).parents("[class*=visitCard]").slideUp(200, function() {
															getUserAddresses();
															useThisAddress(item);
														});
													}
												});
											});
											addrRemove.setAttribute("class", "cardButton");
											$(addrRemove).css("text-align", "right");
											$(addrRemove).attr({
												"weight": 0.0625,
												"size": 1.25,
												"color": "#333",
												"margin": 0.125
											});
											header.appendChild(addrRemove);
											visitCard.appendChild(header);
											
											var span = document.createElement("span");
											span.innerHTML = item.address;
											visitCard.appendChild(span);
											
											var span = document.createElement("span");
											span.innerHTML = `${item.npa} ${item.town}`;
											visitCard.appendChild(span);
											
											var span = document.createElement("span");
											span.innerHTML = item.country;
											visitCard.appendChild(span);
											
											var sep = document.createElement("div");
											sep.classList.add("sep");
											visitCard.appendChild(sep);
											
											var addrModify = document.createElement("a");
											var newAddress;
											addrModify.addEventListener("click", function() {
												// Modifies address
												$(addressList).empty();
												initAddressForm($(addressList), item);
											});
											addrModify.innerHTML = "modify addr";
											visitCard.appendChild(addrModify);
											
											cardContainer.appendChild(visitCard);
										});
										
										addressesContainer.appendChild(cardContainer);
										
										var addrListFooter = document.createElement("a");
										addrListFooter.addEventListener("click", function() {
											// Adds new address
											$(addressList).empty();
											initAddressForm($(addressList), null);
										});
										addrListFooter.setAttribute("class", "button");
										addrListFooter.innerHTML = "a";
										
										addressesContainer.appendChild(addrListFooter);
										
										addressList.appendChild(addressesContainer);
										
										$(addressList).fadeIn(100);
									}
								});
							}
							var element = document.createElement("div");
							element.setAttribute("class", "col full Xmargin");
							
							var span = document.createElement("span");
							span.classList.add("title");
							$(span).attr("name", "userName");
							span.innerHTML = `${address.surname} ${address.name}`;
							element.appendChild(span);
							
							var span = document.createElement("span");
							$(span).attr("name", "addr");
							span.innerHTML = address.address;
							element.appendChild(span);
							
							var span = document.createElement("span");
							$(span).attr("name", "npaTwn");
							span.innerHTML = `${address.npa} ${address.town}`;
							element.appendChild(span);
							
							var span = document.createElement("span");
							$(span).attr("name", "cnty");
							span.innerHTML = address.country;
							element.appendChild(span);
							
							var span = document.createElement("span");
							$(span).attr("name", "ph");
							span.innerHTML = address.phone;
							element.appendChild(span);
							
							var addressSelect = document.createElement("a");
							addressSelect.setAttribute("class", "button");
							addressSelect.innerHTML = "m";
							addressSelect.addEventListener("click", function() {
								getUserAddresses();
							});
							element.appendChild(addressSelect);
							
							var row = document.createElement("div");
							row.setAttribute("class", "row full sb Xmargin");
							var button = document.createElement("a");
							button.classList.add("button");
							button.href = "/cart?step=1";
							button.innerHTML = "Retour";
							row.appendChild(button);
							var button = document.createElement("a");
							button.classList.add("button");
							button.href = "/cart?step=3";
							button.innerHTML = "Suivant";
							row.appendChild(button);
							element.appendChild(row);
							
							$("#content").append(element);
							
							localStorage.setItem("userAddrCart", JSON.stringify(address));
							
							callback();
						}
					});
				} else {
					// Creates an address form
					initAddressForm($("#content"));
					
					callback();
				}
				break;
			
			// CASE OF CART STEP 3 (PAYMENT)
			case /\/cart\?step=3/.test(path):
				pageConfig("TBD", 1);
				
				var showForm;
				
				var container = document.createElement("div");
				container.setAttribute("class", "row full Xmargin");
				
				var methodSelectContainer = document.createElement("div");
				methodSelectContainer.setAttribute("class", "row full sa");
				
				var optionContainer = document.createElement("div");
				optionContainer.setAttribute("class", "col");
				var span = document.createElement("span");
				span.innerHTML = "CB";
				var input = document.createElement("input");
				input.addEventListener("click", function() {
					showForm();
				});
				input.type = "radio";
				input.name = "method";
				input.value = "cb";
				input.checked = true;
				optionContainer.appendChild(span);
				optionContainer.appendChild(input);
				methodSelectContainer.appendChild(optionContainer);
				
				var optionContainer = document.createElement("div");
				optionContainer.setAttribute("class", "col");
				var span = document.createElement("span");
				span.innerHTML = "PP";
				var input = document.createElement("input");
				input.addEventListener("click", function() {
					showForm();
				});
				input.type = "radio";
				input.name = "method";
				input.value = "pp";
				optionContainer.appendChild(span);
				optionContainer.appendChild(input);
				methodSelectContainer.appendChild(optionContainer);
				
				container.appendChild(methodSelectContainer);
				
				var formContainer = document.createElement("div");
				formContainer.id = "form";
				formContainer.setAttribute("class", "col full");
				container.appendChild(formContainer);
				
				
				$("#content").append(container);
				
				showForm = function() {
					$("#form").empty();
					
					switch($("[name=method]:checked").val()) {
						case "cb":
							var span = document.createElement("span");
							span.innerHTML = "Carte bancaires";
							$("#form").append(span);
							
							break;
						
						case "pp":
							var span = document.createElement("span");
							span.innerHTML = "Paypal";
							$("#form").append(span);
							
							break;
					}
				}
				
				showForm();
				
				callback();
				break;
			
			// CASE OF CART
			case /\/cart/.test(path):
				pageConfig("TBD", 1);
				
				document.location.href = `${location.pathname}?step=1`;
				break;
		
			// CASE OF STATS
			case /\/manage\?page=stats/.test(path):
				pageConfig(`${locale["documentTitleManage_core"]} - ${locale["MMenuStats_core"]}`, 0);
				
				callback();
				break;
		
			// CASE OF PRODUCTS CONFIG
			case /\/manage\?page=productsConfig/.test(path):
				pageConfig("TBD", 0);
			
				// Product filter
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
			
				var row = document.createElement("div");
				row.setAttribute("class", "row full sb Xmargin");
				var input = document.createElement("input");
				input.id = "filterProducts";
				input.placeholder = "filtre produits (à faire)";
				input.type = "text";
				var btn = document.createElement("button");
				btn.id="addProduct";
				btn.innerHTML = locale["MAdd_core"];
				btn.addEventListener("click", function() {
					if($("#newProduct:visible").length == 0) {
						common.sendRequest(messages.GET_CATEGORIES_REQUEST, {
							parent: undefined,
							loc: "fr"
						})
						.then(response => {
							if(response.msg === messages.GET_CATEGORIES_SUCCESS) {				
								var categories = response.payload.categories;
	
								var cat = document.getElementById("cat");
								$(cat).empty();
								cat.innerHTML = '<option value="null">Aucun</option>';
								$.each(categories, function(k, v) {
									var option = document.createElement("option");
									if(v.parent == null) {
										option.disabled = true;
									}
									option.value = v.loc_id;
									option.innerHTML = v.name;
		
									cat.appendChild(option);
								});
	
								return response;
							}
						})
						.then(response => {
							if($("#cat option").length != 0) {
								common.initCustomSelects();
							}

							$("#newProduct").slideDown("normal");
						});
					} else {
						if($("#title").val() !== "") {
							var img = [];
							$(".custom-img-select").children("div").children("img:first-child").each((k, v) => {
								if($(v).next().attr('name') === "default") {
									img.push([v.src, 1]);
								} else {
									img.push([v.src, 0]);
								}
							});
				
							common.sendRequest(messages.ADD_NEW_PRODUCT_REQUEST, {
								img: img,
								title: encodeURIComponent($("#title").val()),
								short_description: encodeURIComponent($("#sdesc").val()),
								description: encodeURIComponent($("#desc").val()),
								price: $("#price").val(),
								category: $("#cat").val()
							})
							.then(response => {
								$("#newProduct").slideUp("normal", function() {
									resetAddNewProduct();
								});
							})
							.then(response => {
								getProducts(locale);
							});
						} else {
							$("#newProduct").slideUp("normal", function() {
								resetAddNewProduct();
							});
						}
					}
				});
				row.appendChild(input);
				row.appendChild(btn);
			
				element.appendChild(row);
			
				$("#content").append(element);
			
				// Adding new product
				var element = document.createElement("div");
				element.id = "newProduct";
				element.setAttribute("class", "row full Xmargin list");
			
				var row = document.createElement("div");
				var span = document.createElement("span");
				span.innerHTML = "Titre";
				var input = document.createElement("input");
				input.id = "title";
				input.type = "text";
				row.appendChild(span);
				row.appendChild(input);
			
				element.appendChild(row);
			
				var row = document.createElement("div");
				var span = document.createElement("span");
				span.innerHTML = "Short Description";
				var textarea = document.createElement("textarea");
				textarea.id = "sdesc";
				row.appendChild(span);
				row.appendChild(textarea);
			
				element.appendChild(row);
			
				var row = document.createElement("div");
				var span = document.createElement("span");
				span.innerHTML = "Description";
				var textarea = document.createElement("textarea");
				textarea.id = "desc";
				row.appendChild(span);
				row.appendChild(textarea);
			
				element.appendChild(row);
			
				var row = document.createElement("div");
				var span = document.createElement("span");
				span.innerHTML = "Catégorie";
				var selectContainer = document.createElement("div");
				selectContainer.setAttribute("class", "custom-select cat");
				var select = document.createElement("select");
				select.id = "cat";
				select.innerHTML = '<option value="null">Aucun</option>';
				selectContainer.appendChild(select);
				row.appendChild(span);
				row.appendChild(selectContainer);
			
				element.appendChild(row);
			
				var row = document.createElement("div");
				var span = document.createElement("span");
				span.innerHTML = "Prix";
				var input = document.createElement("input");
				input.id = "price";
				input.type = "number";
				input.min = 0;
				row.appendChild(span);
				row.appendChild(input);
			
				element.appendChild(row);
			
				var row = document.createElement("div");
				var input = document.createElement("input");
				input.setAttribute("class", "img-select");
				input.type = "file";
				input.accept = "image/*";
				input.multiple = true;
				var container = document.createElement("div");
				container.setAttribute("class", "custom-img-select");
				row.appendChild(input);
				row.appendChild(container);
			
				element.appendChild(row);
			
				$("#content").append(element);
				$(element).hide();
			
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
				element.id = "productList";
			
				$("#content").append(element);
			
				// Script
				$("#productList").slideUp(100);
				$("#loadingScreen").css("display", "flex").hide().fadeIn(100, function() {
					$(document).css({"background-color": "rgba(0, 0, 0, 0.5)"});
					common.sendRequest(messages.GET_PRODUCT_DATA_REQUEST, {
						filter: "",
						loc: "en"
					})
					.then(response => {
						if(response.msg === messages.GET_PRODUCT_DATA_SUCCESS) {
							showProducts(locale, response.payload.products);
							common.fillLocaleValues(locale);
						}
				
						return response;
					})
					.then(response => {
						$("#loadingScreen").fadeOut(100);
						$("#productList").css("display", "flex").hide().slideDown(100);
						$(document).css({"background-color": "rgba(0, 0, 0, 0)"});
					})
					.then(response => {
						callback();
					});
				});
				break;
		
			// CASE OF LOCALE CONFIG
			case /\/manage\?page=localeConfig/.test(path):
				pageConfig(`${locale["documentTitleManage_core"]} - ${locale["MMenuConfigLocFiles_core"]}`, 0);
			
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
			
				var row = document.createElement("div");
				row.setAttribute("class", "row full sb Xmargin");
				var selectContainer = document.createElement("div");
				selectContainer.setAttribute("class", "custom-select");
				var select = document.createElement("select");
				select.id = "lang";
				selectContainer.appendChild(select);
			
				var input = document.createElement("input");
				input.id = "newLocFile";
				input.placeholder = locale["MNewLocFile_core"];
				input.type = "text";
				var aButton = document.createElement("button");
				aButton.innerHTML = locale["MAdd_core"];
				aButton.id = "addFile";
				var dButton = document.createElement("button");
				dButton.innerHTML = locale["MDeleteVal_core"];
				dButton.id = "delFile";
			
				row.appendChild(selectContainer);
				row.appendChild(input);
				row.appendChild(aButton);
				row.appendChild(dButton);
			
				element.appendChild(row);
			
				$("#content").append(element);
			
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
				element.id = "keyList";
			
				$("#content").append(element);
			
				// Script
				common.sendRequest(messages.GET_FILES_FROM_PATH_REQUEST, {})
				.then(response => {
					if(response.msg === messages.GET_FILES_FROM_PATH_SUCCESS) {
						var files = response.payload.files;
					
						var lang = document.getElementById("lang");
						$.each(files, function(k, v) {
							var option = document.createElement("option");
							option.value = v
							option.innerHTML = v;
						
							lang.appendChild(option);
						});
					
						showLocaleKeyValuePair(locale);
					
						return response
					}
				})
				.then(response => {
					common.initCustomSelects();
					// INITALIZE SELECTS EVENT
					document.querySelectorAll(".select-items").forEach(item => {
						item.addEventListener("click", function(evt) {
							showLocaleKeyValuePair(locale);
						});
					});
					common.fillLocaleValues(locale);
				})
				.then(response => {
					callback();
				});
				break;
		
			// CASE OF CATEGORIES CONFIG
			case /\/manage\?page=productsCategories/.test(path):
				pageConfig(`${locale["documentTitleManage_core"]} - ${locale["MMenuProductsCat_core"]}`, 0);
			
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
			
				var row = document.createElement("div");
				row.setAttribute("class", "row full sb Xmargin");
				var selectContainer = document.createElement("div");
				selectContainer.setAttribute("class", "custom-select cat");
				var select = document.createElement("select");
				select.id = "cat";
				selectContainer.appendChild(select);
			
				var input = document.createElement("input");
				input.id = "newCat";
				input.placeholder = "nvl categorie";
				input.type = "text";
				var aButton = document.createElement("button");
				aButton.innerHTML = locale["MAdd_core"];
				aButton.id = "addCat";
			
				row.appendChild(selectContainer);
				row.appendChild(input);
				row.appendChild(aButton);
			
				element.appendChild(row);
			
				$("#content").append(element);
			
				var element = document.createElement("div");
				element.setAttribute("class", "row full Xmargin list");
				element.id = "catList";
			
				$("#content").append(element);
			
				// Script
				common.sendRequest(messages.GET_CATEGORIES_REQUEST, {
					parent: null,
					loc: localStorage.getItem("locale")
				})
				.then(response => {
					if(response.msg === messages.GET_CATEGORIES_SUCCESS) {
						var categories = response.payload.categories;
					
						var cat = document.getElementById("cat");
						$.each(categories, function(k, v) {
							var option = document.createElement("option");
							option.value = v.loc_id;
							option.innerHTML = v.name;
						
							cat.appendChild(option);
						});
					
						return locale;
					}
				})
				.then(response => {
					if($("#cat option").length != 0) {
						common.initCustomSelects();
						showSubCategories(locale);
					}
				
					// Adds new category
					$("#addCat").click(function() {
						if($("#newCat").val() != "") {
							common.sendRequest(messages.ADD_CATEGORY_REQUEST, {
								name: $("#newCat").val(),
								parent: null
							})
							.then(response => {
								if(response.msg === messages.ADD_CATEGORY_SUCCESS) {
									var val = $("#newCat").val();
								
									$("#newCat").val("");
									$("#cat").append(`<option value="${response.payload.key}">${val}</option>`);
									$("#cat").val(response.payload.key);
									showSubCategories(locale);
								}
							});
						}
					});
				})
				.then(response => {
					callback();
				});
				break;
		
			// CASE OF MANAGE
			case /\/manage/.test(path):
				pageConfig(locale["documentTitleManage_core"], 0);
				
				//Manage's login
				var span = document.createElement("span");
				span.innerHTML = "UserName";
				var input = document.createElement("input");
				input.id = "userId";
				input.type = "text";
				$("#content").append(span);
				$("#content").append(input);
			
				var span = document.createElement("span");
				span.innerHTML = "Password";
				var input = document.createElement("input");
				input.id = "password";
				input.type = "text";
				$("#content").append(span);
				$("#content").append(input);
			
				var input = document.createElement("input");
				input.id = "login";
				input.type = "button";
				input.value = "Log in";
				input.addEventListener("click", function() {
					var userId = $("#userId").val();
					var password = $("#password").val();
					common.sendRequest(messages.PARTNER_LOGIN_REQUEST, {
						user_id: userId,
						pass: password
					})
					.then(response => {		
						if(response.msg === messages.PARTNER_LOGIN_SUCCESS) {
							location.href = "/manage?page=stats";
						} else if(response.msg === messages.LOGIN_USERNAME_ERROR) {
							console.log("Username doesn't exists");
						} else if(response.msg === messages.LOGIN_PASSWORD_ERROR) {
							console.log("Password is wrong");
						}
					});
				});
				$("#content").append(input);
			
				callback();
				break;
				
			default:
				var lien = document.createElement("a");
				lien.href = "/manage";
				lien.innerHTML = "Manage";
				$("#content").append(lien);
				
				var lien = document.createElement("a");
				lien.href = "/products";
				lien.innerHTML = "Produits";
				$("#content").append(lien);
				
				callback();
		}
	});
	
	
}

/**********************************************************************
|                         Manage login Scripts                        |
**********************************************************************/

/**********************************************************************
|                        Product config Scripts                       |
**********************************************************************/
function getProducts(locale) {
	$("#productList").slideUp(100, function() {
		$("#loadingScreen").css("display", "flex").hide().fadeIn(50);
		$(document).css({"background-color": "rgba(0, 0, 0, 0.5)"});
		common.sendRequest(messages.GET_PRODUCT_DATA_REQUEST, {
			filter: "",
			loc: "en"
		})
		.then(response => {
			if(response.msg === messages.GET_PRODUCT_DATA_SUCCESS) {
				showProducts(locale, response.payload.products);
			}

			return response;
		})
		.then(response => {
			$("#loadingScreen").fadeOut(50);
			$("#productList").css("display", "flex").hide().slideDown(100);
			$(document).css({"background-color": "rgba(0, 0, 0, 0)"});
		});
	});
}

function sortImages(product_img, new_img) {
	var old_img = product_img[0].map((_, col) => product_img.map(row => row[col]))[0];
	var add = new_img.filter(x => !old_img.includes(x));
	var changed = [];
	
	var cadd = add;
	add = [];
	cadd.forEach(item => {
		if($('[src="' + item + '"]').next().attr('name') === "default") {
			add.push([item, 1]);
		} else {
			add.push([item, 0]);
		}
	});
	
	product_img.forEach(item => {
		var def = 0;
		if($('[src="' + item[0] + '"]').next().attr('name') === "default") {
			def = 1;
		} else {
			def = 0;
		}
		
		if(item[1] != def) {
			changed.push([item[0], def]);
		}
	});
	
	var img = {
		del: old_img.filter(x => !new_img.includes(x)),
		add: add,
		changed: changed
	};
	
	return img;
}

function showProductData(t, locale, product, loc, callback) {
	// TODO : ADD IN SOME GOOD TRANSITION
	var productDetails_node = $(t).next(".productDetails");
	common.sendRequest(messages.GET_PRODUCT_DATA_REQUEST, {
		filter: "",
		loc: loc,
		id: product.id
	})
	.then(response => {
		if(response.msg === messages.GET_PRODUCT_DATA_SUCCESS) {
			product = response.payload.products[0];
			
			// Locale
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin align-left lang");
			var innerRow_node = document.createElement("div");
			innerRow_node.setAttribute("class", "custom-select lang");
			var select = document.createElement("select");
			innerRow_node.appendChild(select);
		
			common.sendRequest(messages.GET_FILES_FROM_PATH_REQUEST, {})
			.then(response => {
				if(response.msg === messages.GET_FILES_FROM_PATH_SUCCESS) {
					var files = response.payload.files;
				
					$(".lang").children("select").empty();
					$.each(files, function(k, v) {
						var option = document.createElement("option");
						option.value = v
						option.innerHTML = v;

						$(".lang").children("select").append(option);
					});
					
					$(".lang").children("select").val(loc);
			
					//common.initCustomSelects();
					
					return response;
				}
			});
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Title
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin title");
			row.innerHTML = "<span>Titre</span>";
			var innerRow_node = document.createElement("input");
			innerRow_node.type = "text";
			innerRow_node.name = product.title_id;
			innerRow_node.value = decodeURIComponent(product.title);
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Short description
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin title sdesc");
			row.innerHTML = "<span>Short Description</span>";
			var innerRow_node = document.createElement("input");
			innerRow_node.type = "text";
			innerRow_node.name = product.short_description_id;
			innerRow_node.value = decodeURIComponent(product.short_description);
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Description
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin desc");
			row.innerHTML = "<span>Description</span>";
			var innerRow_node = document.createElement("textarea");
			innerRow_node.name = product.description_id;
			innerRow_node.value = decodeURIComponent(product.description);
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Categories
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin cat");
			row.innerHTML = "<span>Catégorie</span>";
			var innerRow_node = document.createElement("div");
			innerRow_node.setAttribute("class", "custom-select cat");
			var select = document.createElement("select");
			select.innerHTML = '<option value="null">Aucun</option';
			innerRow_node.appendChild(select);
		
			common.sendRequest(messages.GET_CATEGORIES_REQUEST, {
				parent: undefined,
				loc: "fr"
			})
			.then(response => {
				if(response.msg === messages.GET_CATEGORIES_SUCCESS) {				
					var categories = response.payload.categories;
				
					$.each(categories, function(k, v) {
						var option = document.createElement("option");
						if(v.parent == null) {
							option.disabled = true;
						}
						option.value = v.loc_id;
						option.innerHTML = v.name;
					
						select.appendChild(option);
					});
				
					return response;
				}
			})
			.then(response => {
				if($(select).children("option").length != 0) {
					if(product.category === null) {
						$(select).children("option:first-child").prop("selected", true);
					} else {
						$(select).val(product.category_id);
					}
					common.initCustomSelects();
		
					// Reload product's details on locale change
					$(t).siblings(".productDetails").find(".lang .select-items").click(function() {
						productDetails_node.slideUp(100, function() {
							var loc = $(this).find(".lang").children("select").val();
							
							productDetails_node.empty();
							showProductData(t, locale, product, loc, function() {
								productDetails_node.slideDown(100);
							});
						});
					});
				}
			});
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Price
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin price");
			row.innerHTML = "<span>Price</span>";
			var innerRow_node = document.createElement("input");
			innerRow_node.type = "number";
			innerRow_node.min = 0;
			innerRow_node.value = product.price;
		
			row.appendChild(innerRow_node);
			productDetails_node.append(row);
			
			// Image select
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin img");
			var input = document.createElement("input")
			input.classList.add("img-select");
			input.setAttribute("accept", "image/*");
			input.setAttribute("multiple", "");
			input.type = "file";
			var imgSelectContainer_node = document.createElement("div");
			imgSelectContainer_node.classList.add("custom-img-select");
			imgSelectContainer_node.addEventListener("click", function(e) {
				initImageSelect();
				triggerImgSelect(e);
			});
			
			var once = true;
			$.each(product.img, (k, img) => {
				var image_node = document.createElement("div");
			
				var image = document.createElement("img");
				image.src = img[0];
			
				var default_img = document.createElement("img");
				default_img.src = "./src/img/default.jpg";
				if(img[1]) {
					default_img.name = "default";
					once = false;
				} else {
					$(default_img).css("filter", "grayscale()");
				}
				default_img.addEventListener("click", function(e) {
					$(this).parents(".custom-img-select").find('[src="./src/img/default.jpg"]').css("filter", "grayscale()");
					$(this).parents(".custom-img-select").find('[src="./src/img/default.jpg"]').removeAttr("name");
					this.name = "default";
					$(this).css("filter", "none");
					e.stopPropagation();
				});
			
				var remove_img = document.createElement("img");
				remove_img.src = "./src/img/remove.png";
				remove_img.addEventListener("click", function(e) {
					$(this).parent("div").remove();
					e.stopPropagation();
				});
				
				image_node.appendChild(image);
				image_node.appendChild(default_img);
				image_node.appendChild(remove_img);
			
				imgSelectContainer_node.appendChild(image_node);
			});
			
			row.appendChild(input);
			row.appendChild(imgSelectContainer_node);
			productDetails_node.append(row);
			
			// Update button
			var row = document.createElement("div");
			row.setAttribute("class", "row full sb Xmargin align-right");
			var uButton = document.createElement("button");
			uButton.value = product.id;
			uButton.innerHTML = locale["MAdd_core"];
			// Update product
			uButton.addEventListener("click", function() {
				var img = [];
				$(this).parent().siblings('[class="row full sb Xmargin img"]').find(".custom-img-select div").each((k, i) => {
					img.push($(i).children(":first-child").attr("src"));
				});
				common.sendRequest(messages.UPDATE_PRODUCT_DATA_REQUEST, {
					id: $(this).val(),
					img: sortImages(product.img, img),
					title: encodeURIComponent($(this).parent().siblings('[class*=title]').children("input").val()),
					short_description: encodeURIComponent($(this).parent().siblings('[class*=sdesc]').children("textarea").val()),
					description: encodeURIComponent($(this).parent().siblings('[class*=desc]').children("textarea").val()),
					category: $(this).parent().siblings('[class*=cat]').find("select").val(),
					price: $(this).parent().siblings('[class*=price]').children("input").val(),
					loc: $(this).parent().siblings('[class*=lang]').find("select").val()
				});
			});
			
			row.appendChild(uButton);
			productDetails_node.append(row);
		}
	})
	.then(response => {
		common.fillLocaleValues(locale);
		
		if(callback) {
			callback();
		} else {
			productDetails_node.slideDown(100);
		}
	})
}

function showProducts(locale, products) {
	$("#productList").empty();
	
	var productsList_node = document.getElementById("productList");
	
	for(const [k, v] of Object.entries(products)) {
		var product_node = document.createElement("div");
		product_node.setAttribute("class", "row full Xmargin list");
		
		var productHeader_node = document.createElement("div");
		productHeader_node.setAttribute("class", "row full sb Xmargin productHeader clickable");
		productHeader_node.innerHTML = "<span>" + decodeURIComponent(v.title) + "</span>";
		productHeader_node.addEventListener("click", function() {
			if(!$(this).next("div").is(":visible")) {
				$(".productHeader").next("div").slideUp(100, function() {
					$(".productHeader").next("div").empty();
				});
				showProductData(this, locale, v, "en");
			} else {
				$(this).next("div").slideUp(100);
			}
		});
		
		var dButton = document.createElement("button");
		dButton.innerHTML = locale["MAdd_core"];
		dButton.value = v.id;
		dButton.innerHTML = locale["MDeleteVal_core"];
		dButton.addEventListener("click", function(e) {
			e.stopPropagation();
			common.sendRequest(messages.DELETE_PRODUCT_REQUEST, {
				id: v.id,
				titleId: v.title_id,
				short_descriptionId: v.short_description_id,
				descriptionId: v.description_id
			})
			.then(response => {
				getProducts(locale);
			});
		});
		
		productHeader_node.appendChild(dButton);
		
		var productDetails_node = document.createElement("div");
		productDetails_node.classList.add("productDetails");
		$(productDetails_node).css("display", "none");
		
		//////////////////////////////////////////////////////////////////////
		
		product_node.appendChild(productHeader_node);
		product_node.appendChild(productDetails_node);
	
		productsList_node.appendChild(product_node);
	}

	$(".custom-img-select").click((evt) => {
		initImageSelect();
		triggerImgSelect(evt);
	});

	//$("#addProduct").click(function() {
	//});
}

function initImageSelect() {
	$(".img-select").off("change");
	$(".img-select").change(function() {
		var t = this;
		Array.from(this.files).forEach(file => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				var image_node = document.createElement("div");
			
				var image = document.createElement("img");
				image.src = e.target.result;

				var default_img = document.createElement("img");
				default_img.src = "./src/img/default.jpg";
				
				// TODO: Check the issue, doesn't seems to work everytime
				if($(t).next("div").children().length == 0) {
					default_img.name = "default";
				} else {
					$(default_img).css("filter", "grayscale()");
				}
				
				default_img.addEventListener("click", function(e) {
					$(this).parents(".custom-img-select").find('[src="./src/img/default.jpg"]').css("filter", "grayscale()");
					$(this).parents(".custom-img-select").find('[src="./src/img/default.jpg"]').removeAttr("name");
					this.name = "default";
					$(this).css("filter", "none");
					e.stopPropagation();
				});
			
				var remove_img = document.createElement("img");
				remove_img.src = "./src/img/remove.png";
				remove_img.addEventListener("click", function(e) {
					$(this).parent("div").remove();
					e.stopPropagation();
				});
			
				image_node.appendChild(image);
				image_node.appendChild(default_img);
				image_node.appendChild(remove_img);
				
				$(t).next("div").append(image_node);
			}
		});
	});
}

function resetAddNewProduct() {
	$("#title").val("");
	$("#sdesc").val("");
	$("#desc").val("");
	$("#price").val("");
	$("#cat").children("option:first-child").prop("selected", true);
}

function triggerImgSelect(evt) {
	$(evt.target).prev("input").trigger("click");
}

/**********************************************************************
|                         Locale config Scripts                       |
**********************************************************************/
function showLocaleKeyValuePair(locale) {
	common.sendRequest(messages.GET_LOCALE_CONTENT_REQUEST, {
		pth: $("#lang").val()
	})
	.then((response) => {
		if(response.msg === messages.GET_LOCALE_CONTENT_SUCCESS) {
			$("#keyList").fadeOut(100, function() {
				$("#keyList").empty();
				
				var content = response.payload.content;
			
				$.each(content, function(k, v) {
					var elem_node = document.createElement("div");
					$(elem_node).attr("class", "row full Xmargin list");

					var col_node = document.createElement("div");
					$(col_node).attr("class", "row full sb Xmargin");

					var key_node = document.createElement("span");
					key_node.innerHTML = k;
	
					var button = document.createElement("button");
					button.name = "keyUpdate";
					button.innerHTML = locale["MUpdateKeyVal_core"];
					button.addEventListener("click", function() {
						common.sendRequest(messages.UPDATE_LOCALE_KEY_VALUE_REQUEST, {
							pth: $("#lang").val(),
							key: k,
							value: $(this).parent().next("textarea").val()
						})
						.then(response => {
							if(response.msg === messages.UPDATE_LOCALE_KEY_VALUE_SUCCESS) {
								$(this).prev("span").html(response.payload.key);
							}
						});
					});
				
					$(col_node).append(key_node);
					$(col_node).append(button);
				
					var textarea_node = document.createElement("textarea");
					textarea_node.name = "keyText";
					textarea_node.value = v;
					textarea_node.addEventListener("input", function() {
						if($(this).val() === k) {
							$(this).prev().children("span").html(k);
						}else {
							$(this).prev().children("span").html(k + "*");
						}
					});
				
					$(elem_node).append(col_node);
					$(elem_node).append(textarea_node);
	
					$("#keyList").append(elem_node);
				});
			});
		}
	})
	.then(response => {
		$("#keyList").fadeIn(100);
	})
}

// Adds new localisation file (ConfigLocale)
$("#addFile").click(function() {
	if($("#newLocFile").val() != "") {
		common.sendRequest(messages.ADD_LOCALE_FILE_REQUEST, {
			file: $("#newLocFile").val()
		})
		.then(response => {
			if(response.msg === messages.ADD_LOCALE_FILE_SUCCESS) {
				location.reload();
			}
		});
	}
});

// Deletes localisation file (ConfigLocale)
$("#delFile").click(function() {
	common.sendRequest(messages.DELETE_LOCALE_FILE_REQUEST, {
		file: $("#lang").val()
	})
	.then(response => {
		if(response.msg === messages.DELETE_LOCALE_FILE_SUCCESS) {
			location.reload();
		}
	});
});

/**********************************************************************
|                       Categories config Scripts                     |
**********************************************************************/
function showCatKeyValuePair(locale, parent, loc) {
	common.sendRequest(messages.GET_CATEGORIES_REQUEST, {
		parent: parent,
		loc: loc
	})
	.then(response => {
		if(response.msg === messages.GET_CATEGORIES_SUCCESS) {
			$("#subCatList").fadeOut(100, function() {
				$("#subCatList").empty();
		
				$.each(response.payload.categories, function(k, v) {
					var subCat_node = document.createElement("div");
					$(subCat_node).attr("class", "row full Xmargin list");
	
					var subCatRow_node = document.createElement("div");
					var input = document.createElement("input");
					input.name = v.loc_id;
					input.value = v.name;
					input.addEventListener("input", function() {
						if($(this).val === v.name) {
							$(this).next("button").attr("disabled", true);
						} else {
							$(this).next("button").attr("disabled", false);
						}
					});
	
					var uButton = document.createElement("button");
					uButton.innerHTML = locale["MAdd_core"];
					uButton.disabled = true;
					uButton.addEventListener("click", function() {
						common.sendRequest(messages.UPDATE_CATEGORY_REQUEST, {
							key: $(this).siblings("input").attr("name"),
							loc: $("#lang").val(),
							value: $(this).siblings("input").val()
						})
						.then(response => {
							if(response.msg === messages.UPDATE_CATEGORY_SUCESS) {
								showCatKeyValuePair(locale, parent, loc);
							}
						});
					});
	
					var dButton = document.createElement("button");
					dButton.innerHTML = locale["MAdd_core"];
					dButton.addEventListener("click", function() {
						common.sendRequest(messages.DELETE_CATEGORY_REQUEST, {
							key: $(this).siblings("input").attr("name")
						})
						.then(response => {
							if(response.msg === messages.DELETE_CATEGORY_SUCCESS) {
								showCatKeyValuePair(locale, parent, loc);
							}
						});
					});
					
					subCatRow_node.appendChild(input);
					subCatRow_node.appendChild(uButton);
					subCatRow_node.appendChild(dButton);
					
					subCat_node.appendChild(subCatRow_node);
					$("#subCatList").append(subCat_node);
				});
				
				var subCat_node = document.createElement("div");
				$(subCat_node).attr("class", "row full Xmargin list");

				var subCatRow_node = document.createElement("div");
				var input = document.createElement("input");
				$(input).hide();
				var button = document.createElement("button");
				button.innerHTML = locale["MAdd_core"];
				button.addEventListener("click", function() {
					if($(this).prev("input:visible").length != 0) {
						if($(this).prev("input:visible").val() !== "") {
							common.sendRequest(messages.ADD_CATEGORY_REQUEST, {
								name: $(this).prev("input").val(),
								parent: $("#cat").val()
							})
							.then(response => {
								if(response.msg === messages.ADD_CATEGORY_SUCCESS) {
									showCatKeyValuePair(locale, parent, loc);
								}
							});
						}
					} else {
						$(this).prev("input").slideDown(100);
					}
				});
				
				subCatRow_node.appendChild(input);
				subCatRow_node.appendChild(button);
				
				subCat_node.appendChild(subCatRow_node);
				$("#subCatList").append(subCat_node);
				
				common.fillLocaleValues(locale);
			});
			
			return response;
		}
	})
	.then(response => {	
		$("#subCatList").fadeIn(100);
	});
}

function showSubCategories(locale) {
	$("#catList").empty();
	
	common.sendRequest(messages.GET_FILES_FROM_PATH_REQUEST, {})
	.then(response => {
		if(response.msg === messages.GET_FILES_FROM_PATH_SUCCESS) {
			var files = response.payload.files;
			
			var row_node = document.createElement("div");
			$(row_node).attr("class", "row full sb Xmargin");
			
			var customSelect_node = document.createElement("div");
			customSelect_node.setAttribute("class", "custom-select lang");
			
			var langSelect = document.createElement("select");
			langSelect.id = "lang";
			
			$.each(files, function(k, v) {
				var option = document.createElement("option");
				option.value = v
				option.innerHTML = v;
				
				langSelect.appendChild(option);
			});
			
			customSelect_node.appendChild(langSelect);
			
			var subCatList_node = document.createElement("div");
			subCatList_node.id = "subCatList";
			subCatList_node.setAttribute("class", "row full Xmargin list");
			
			// TODO Get selected parent cat
			var input = document.createElement("input");
			input.name = $("#cat").val();
			input.value = $("#cat").find(":selected").html();
			input.addEventListener("input", function() {
				if($(this).val === $("#cat").find(":selected").html()) {
					$(this).next("button").attr("disabled", true);
				} else {
					$(this).next("button").attr("disabled", false);
				}
			});
			
			var uButton = document.createElement("button");
			uButton.innerHTML = locale["MUpdateKeyVal_core"];
			uButton.addEventListener("click", function() {
				common.sendRequest(messages.UPDATE_CATEGORY_REQUEST, {
					key: $(this).siblings("input").attr("name"),
					loc: $("#lang").val(),
					value: $(this).siblings("input").val()
				})
				.then(response => {
					if(response.msg === messages.UPDATE_CATEGORY_SUCESS) {
						showSubCategories(locale);
					}
				});
			});
			
			var dButton = document.createElement("button");
			dButton.innerHTML = locale["MDeleteVal_core"];
			dButton.addEventListener("click", function() {
				common.sendRequest(messages.DELETE_CATEGORY_REQUEST, {
					key: $(this).siblings("input").attr("name")
				})
				.then(response => {
					if(response.msg === messages.DELETE_CATEGORY_SUCCESS) {
						common.sendRequest(messages.GET_CATEGORIES_REQUEST, {
							parent: null,
							loc: localStorage.getItem("locale")
						})
						.then(response => {
							if(response.msg === messages.GET_CATEGORIES_SUCCESS) {
								var categories = response.payload.categories;
					
								var cat = document.getElementById("cat");
								$(cat).empty();
								$.each(categories, function(k, v) {
									var option = document.createElement("option");
									option.value = v.loc_id;
									option.innerHTML = v.name;
						
									cat.appendChild(option);
								});
								$("#cat").val(categories[0].loc_id);
					
								return locale;
							}
						})
						.then(response => {
							if($("#cat option").length != 0) {
								var key = $(this).siblings("input").attr("name");
								$("#cat").children('[name="' + key + '"]').remove();
								common.initCustomSelects();
								showSubCategories(locale);
							}
						});
					}
				});
			});
			
			$(row_node).append(customSelect_node);
			$(row_node).append(input);
			$(row_node).append(uButton);
			$(row_node).append(dButton);
			
			$("#catList").append(row_node);
			$("#catList").append(subCatList_node);
			
			return response
		}
	})
	.then(response => {
		common.initCustomSelects();
		
		// INITALIZE SELECTS EVENT
		$(".lang").children(".select-items").click(function() {
			showCatKeyValuePair(locale, $("#cat").val(), $("#lang").val());
		});
		$(".cat").children(".select-items").click(function() {
			showSubCategories(locale);
		});
		
		showCatKeyValuePair(locale, $("#cat").val(), $("#lang").val());
	});
}

/**********************************************************************
|                        Products viewer Scripts                      |
**********************************************************************/
function getCursorPos(e, img) {
	var a = img.getBoundingClientRect() || { left: 0, top: 0 };
	e = e || window.event;
	
	var x = e.pageX - a.left;
	var y = e.pageY - a.top;
	
	x -= window.pageXOffset;
	y -= window.pageYOffset;
	
	return { x: x, y: y };
}

function moveLens(e, originalImg, img, lens, zoom) {
	e.preventDefault();
	
	var pos = getCursorPos(e, img);
	var cx = originalImg.width / img.offsetWidth;
	var cy = originalImg.height / img.offsetHeight;
	
	var x = pos.x + img.offsetLeft;
	var y = pos.y + img.offsetTop;
	
	x -= lens.offsetWidth / 2;
	y -= lens.offsetHeight / 2;
	
	if(x > img.width - lens.offsetWidth + img.offsetLeft) { x = img.width - lens.offsetWidth + img.offsetLeft; }
	if(x < img.offsetLeft) { x = img.offsetLeft; }
	if(y > img.height - lens.offsetHeight + img.offsetTop) { y = img.height - lens.offsetHeight + img.offsetTop; }
	if(y < img.offsetTop) { y = img.offsetTop; }
	
	lens.style.left = `${x}px`;
	lens.style.top = `${y}px`;
	
	var bgPos = {
		left: (lens.offsetLeft - img.offsetLeft) * cx,
		top: (lens.offsetTop - img.offsetTop) * cy
	}
	
	zoom.style.backgroundPosition = `-${bgPos.left}px -${bgPos.top}px`;
}

function initZoomingSize(originalImg, bigImg, zoom, lens) {
							
	var cx = originalImg.width / $(bigImg).width();
	var cy = originalImg.height / $(bigImg).height();

	// TODO Init lens and zoom image // Nedds to be updated on window size change
	var zoomBR = $(zoom).css("border-radius").substr(0, $(zoom).css("border-radius").length - 2);
	
	if($("body").width() < $("body").height()) {
		$(zoom).width($("body").width() / 2);
		$(zoom).height($("body").width() / 2);
		$(lens).width(($("body").width() / 2) / cx);
		$(lens).height(($("body").width() / 2) / cx);
		$(lens).css("border-radius", `${zoomBR / cx}px`);
	} else {
		$(zoom).width($("body").height() / 2);
		$(zoom).height($("body").height() / 2);
		$(lens).width(($("body").height() / 2) / cy);
		$(lens).height(($("body").height() / 2) / cy);
		$(lens).css("border-radius", `${zoomBR / cy}px`);
	}
}

function assignZoomImg(url, bigImg, zoom, callback) {
	var result = {};
	var newImg = new Image();
	
	newImg.onload = function() {
		result = {
			width: newImg.width,
			height: newImg.height
		}
		
		initZoomingSize(result, bigImg, zoom, lens);
		
		zoom.style.backgroundImage = `url("${bigImg.attr('src')}")`;
		zoom.style.backgroundSize = `${result.width}px ${result.height}px`;
		
		callback(result);
	}
	
	newImg.src = url;
}

function setZoomContainerPos(e, t) {
/*
	if((e.clientX - $(t).offset().left) < $(t).width() / 2) {
		$("#zoom").css("left", "auto");
	} else {
		$("#zoom").css("left", 0);
	}

	if((e.clientY - $(t).offset().top) < $(t).height() / 2) {
		$("#zoom").css("top", "auto");
	} else {
		$("#zoom").css("top", 0);
	}
*/
}

/**********************************************************************
|                          General functions                          |
**********************************************************************/
function updateCart(id, amount) {
	var cart = JSON.parse(localStorage.getItem("cart"));
	
	if(cart) {
		if(cart[id]) {
			cart[id] += amount;
		} else {
			cart[id] = amount;
		}
	} else {
		cart = {};
		cart[id] = amount;
	}
	
	localStorage.setItem("cart", JSON.stringify(cart));
	
	updateCartVisual(false, id, amount);
}

function updateCartVisual(c, id, amount, callback) {
	var cart = JSON.parse(localStorage.getItem("cart"));
	
	updateCartSticker(cart);
	
	if(c) {
		if(Object.keys(cart).length != 0) {
			$("#cart").children("div:last-child").children("div:first-child").empty();
			var counter = 0;
			for (const [key, value] of Object.entries(cart)) {
				common.sendRequest(messages.GET_PRODUCTS_SHORT_DATA_REQUEST, {
					filter: "",
					id: key,
					loc: localStorage.getItem("locale")
				})
				.then(response => {
					if(response.msg === messages.GET_PRODUCTS_SHORT_DATA_SUCCESS) {
						addCartComponent(response.payload.products[0], value);
						counter++;
						if(counter == Object.keys(cart).length) {
							callback();
						}
					}
				});
			}
		} else {
			callback();
		}
	} else {
		if(Object.keys(cart).length != 0) {
			if($("#cart").children("div:last-child").find(`[data-id=${id}]`).length != 0) {
				let n = parseInt($("#cart").children("div:last-child").find(`[data-id=${id}]`).find("[quantity]").html().match(/\d+/));
				$("#cart").children("div:last-child").find(`[data-id=${id}]`).find("[quantity]").html(`Quantité : ${n + amount}`)
			} else {
				common.sendRequest(messages.GET_PRODUCTS_SHORT_DATA_REQUEST, {
					filter: "",
					id: id,
					loc: localStorage.getItem("locale")
				})
				.then(response => {
					if(response.msg === messages.GET_PRODUCTS_SHORT_DATA_SUCCESS) {
						addCartComponent(response.payload.products[0], amount);
					}
				});
			}
		}
	}
	
	// calc total
}

function updateCartSticker(cart) {
	$("#cart").children("div:first-child").html(Object.keys(cart).length);
	
	if(Object.keys(cart).length != 0) {
		if($("#cart").children("div:first-child:visible").length == 0) {
			$("#cart").children("div:first-child").css("display", "flex").hide().fadeIn(100);
			var link = document.createElement("a");
			link.classList.add("button");
			link.href = "/cart";
			link.innerHTML = "Voir le panier";
			
			$("#cart").children("div:last-child").append(link);
		}
	} else {
		if($("#cart").children("div:first-child:visible").length != 0) {
			$("#cart").children("div:first-child").fadeOut(100);
			$("#cart").children("div:last-child").children("a").remove();
		}
	}
}

function addCartComponent(product, amount) {
	var productLink = document.createElement("a");
	productLink.setAttribute("data-id", product.id);
	productLink.href = "./products?p=" + product.id;
	
	var productImg = document.createElement("img");
	if(product.img == null) {
		productImg.src = "src/img/default.jpeg";
	} else {
		productImg.src = product.img;
	}
	productLink.appendChild(productImg);
	
	var productInfo = document.createElement("p");
	productInfo.setAttribute("class", "textOverflow");
	productInfo.innerHTML = decodeURIComponent(product.title);
	productLink.appendChild(productInfo);
	
	var productInfo = document.createElement("p");
	productInfo.setAttribute("class", "textOverflow");
	productInfo.setAttribute("quantity", "");
	productInfo.innerHTML = "Quantité : " + amount;
	productLink.appendChild(productInfo);
	
	var productInfo = document.createElement("p");
	productInfo.setAttribute("class", "textOverflow");
	productInfo.innerHTML = product.price;
	productLink.appendChild(productInfo);
	
	var productRemove = document.createElement("template-remove");
	productRemove.setAttribute("class", "cardButton");
	$(productRemove).attr({
		"weight": 0.0625,
		"size": 1.25,
		"color": "#333",
		"margin": 0.125
	});
	productRemove.addEventListener("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		var cart = JSON.parse(localStorage.getItem("cart"));
		delete cart[$(this).parent("a").attr("data-id")];
		
		localStorage.setItem("cart", JSON.stringify(cart));
		updateCartSticker(cart);
		
		$(this).parent("a").animate({
			height: 0,
			opacity: 0
		}, 250, function() {
			$(this).remove();
		});
	});
	productLink.appendChild(productRemove);
	
	$("#cart").children("div:last-child").children("div:first-child").append(productLink);
}

function pageConfig(title, ltype) {
	$(document).attr("title", title);
	
	// 0 = mx; 1 = cx; 1000*60*10 - 1000*30 == 9m30s
	if(ltype == 0) {
		common.keepAlive({
			token: common.getCookie("mx-access-token"),
			s: 0
		})
		.then(response => {
			if(response.msg === messages.SESSION_KEEP_ALIVE_SUCCESS) {
				keepAliveInterval = setInterval(function() {
					common.keepAlive({
						token: common.getCookie("mx-access-token"),
						s: 0
					})
					.then(response => {
						if(response.msg !== messages.SESSION_KEEP_ALIVE_SUCCESS) {
							clearTimeout(keepAliveInterval);
						}
					});
				}, 1000*60*10 - 1000*30);
			}
		});
		
		$("#RHeader").remove();
	} else {
		common.keepAlive({
			token: common.getCookie("cx-access-token"),
			s: 1
		})
		.then(response => {
			if(response.msg === messages.SESSION_KEEP_ALIVE_SUCCESS) {
				keepAliveInterval = setInterval(function() {
					common.keepAlive({
						token: common.getCookie("cx-access-token"),
						s: 1
					})
					.then(response => {
						if(response.msg !== messages.SESSION_KEEP_ALIVE_SUCCESS) {
							clearTimeout(keepAliveInterval);
						}
					});
				}, 1000*60*10 - 1000*30);
			}
		});
	}
}

class TemplateRemove extends HTMLElement {
	constructor() {
		super();
		
		var shadow = this.attachShadow({mode: "open"});
		
		var span = document.createElement("span");
		span.style.position = "absolute";
		span.style.height = "0rem";
		span.style.border = "solid";
		span.style.transform = "rotate(45deg)";
		shadow.appendChild(span);
		
		var span = document.createElement("span");
		span.style.position = "absolute";
		span.style.height = "0rem";
		span.style.border = "solid";
		span.style.transform = "rotate(-45deg)";
		shadow.appendChild(span);
	}
	
	connectedCallback() {
		updateRemoveTemplate(this);
	}
}

function updateRemoveTemplate(elem) {
	var weight = parseFloat(elem.getAttribute("weight"));
	var size = parseFloat(elem.getAttribute("size"));
	var color = elem.getAttribute("color");
    var margin = parseFloat(elem.getAttribute("margin"));
    
    $(elem).css({
    	position: "relative",
    	width: `${size}rem`,
        height: `${size}rem`
    });
    
    var strokeSize = size - (margin*2 + weight*2);
	elem.shadowRoot.childNodes.forEach(item => {
        $(item).css({
        	width: `${strokeSize}rem`,
            "border-width": `${weight}rem`,
            "border-color": color,
            "borderRadius": `${weight}rem`,
			left: `${margin}rem`,
			top: `calc(50% - ${weight}rem)`
        });
	});
}

customElements.define("template-remove", TemplateRemove);

class TemplateBack extends HTMLElement {
	constructor() {
		super();
		
		var shadow = this.attachShadow({mode: "open"});
		
		var span = document.createElement("span");
		span.style.position = "absolute";
		span.style.height = "0rem";
		span.style.border = "solid";
		shadow.appendChild(span);
		
		var span = document.createElement("span");
		span.style.position = "absolute";
		span.style.height = "0rem";
		span.style.border = "solid";
		shadow.appendChild(span);
	}
	
	connectedCallback() {
		updateBackTemplate(this);
	}
}

function updateBackTemplate(elem) {
	var weight = parseFloat(elem.getAttribute("weight"));
	var size = parseFloat(elem.getAttribute("size"));
	var color = elem.getAttribute("color");
    var margin = parseFloat(elem.getAttribute("margin"));
    var angle = parseFloat(elem.getAttribute("angle"));
    
    var a = angle / -2;
    
    $(elem).css({
    	position: "relative",
    	width: `${size}rem`,
        height: `${size}rem`
    });
    
	elem.shadowRoot.childNodes.forEach(item => {
    	var rad = a * Math.PI / 180;
    	var strokeSize = (size/1.1 - (margin*2 + weight*2)) * Math.abs(Math.sin(rad));
        console.log((strokeSize/2) * Math.sin(rad) - weight);
        $(item).css({
        	width: `${strokeSize}rem`,
            "border-width": `${weight}rem`,
            "border-color": color,
            "borderRadius": `${weight}rem`,
			left: `calc(50% - ${strokeSize/2 + weight}rem)`,
			top: `calc(50% + ${(strokeSize/2 + weight/2) * Math.sin(rad) - weight}rem)`,
            transform: `rotate(${a}deg)`
        });
        
        a += angle;
	});
}

customElements.define("template-back", TemplateBack);

/**********************************************************************
|                            DOCUMENT READY                           |
**********************************************************************/
function initLogEvents() {
	// Mobile log events
	$("#log").on("touchend", function(e) {
		e.stopPropagation();
		//e.preventDefault();
		$("#log > div:last-child").animate({
			height: "toggle",
			opacity: "toggle"
		}, 250);
	});
	
	// Mouse log events
	var logTimeout, logMouseToggle, bindLogEnter, bindLogLeave;

	logMouseToggle = function() {
		$("#log").off("mouseenter");
		$("#log").off("mouseleave");
		$("#log > div:last-child").animate({
			height: "toggle",
			opacity: "toggle"
		}, 250, function() {
			bindLogEnter();
			bindLogLeave();
		});
	}

	bindLogLeave = function() {
		$("#log").on("mouseleave", function() {
			if(!$("#log > div:last-child > input").is(":focus")) {
				logTimeout = setTimeout(function() {
					logMouseToggle();
				}, 250);
			}
		});
	}

	bindLogEnter = function() {
		$("#log").on("mouseenter", function() {
			if($("#log > div:last-child:visible").length == 0) {
				logMouseToggle();
			} else {
				clearTimeout(logTimeout);
			}
		});
	}

	bindLogEnter();
	bindLogLeave();
	
	// Client login
	// TODO: Optimise mobile and mouse event like this below
	var initLogin, initLogout;

	initLogin = function() {
		var input = document.createElement("input");
		input.addEventListener("touchend", function(e) {
			e.stopPropagation();
		})
		input.type = "text";
		input.name = "user";
		input.placeholder = "u";
		$("#log > div:last-child").append(input);

		var input = document.createElement("input");
		input.addEventListener("touchend", function(e) {
			e.stopPropagation();
		})
		input.type = "text";
		input.name = "pass";
		input.placeholder = "p";
		$("#log > div:last-child").append(input);

		var login = document.createElement("a");
		login.classList.add("button");
		login.addEventListener("click", function() {
			common.sendRequest(messages.LOGIN_REQUEST, {
				user_id: $(this).siblings("[name=user]").val(),
				pass: $(this).siblings("[name=pass]").val()
			})
			.then(response => {
				if(response.msg === messages.LOGIN_SUCCESS) {
					location.reload();
				}
			});
		});
		login.addEventListener("touchend", function(e) {
			e.stopPropagation();
		});
		login.innerHTML = "l";
		$("#log > div:last-child").append(login);
	}

	initLogout = function() {
		var logout = document.createElement("a");
		logout.classList.add("button");
		logout.addEventListener("click", function() {
			common.sendRequest(messages.LOGOUT_REQUEST, {
				token: common.getCookie("cx-access-token")
			})
			.then(response => {
				if(response.msg === messages.LOGOUT_SUCCESS) {
					$("#log > div:last-child").empty();
					
					location.reload();
				}
			});
		});
		logout.addEventListener("touchend", function(e) {
			e.stopPropagation();
		});
		logout.innerHTML = "Deco";

		$("#log > div:last-child").append(logout);
	}
	
	if(common.getCookie("cx-access-token")) {
		initLogout();
	} else {
		initLogin();
	}
}

function initCartEvents() {
	// Mobile cart events
	var cartMobileToggle = function(e) {
		e.stopPropagation();
		//e.preventDefault();
		$("#cart > div:last-child").animate({
			height: "toggle",
			opacity: "toggle"
		}, 250);
	}

	$("#cart").on("touchend", cartMobileToggle);

	// Mouse cart events
	var cartTimeout, cartMouseToggle, bindCartEnter, bindCartLeave;

	cartMouseToggle = function() {
		$("#cart").off("mouseenter");
		$("#cart").off("mouseleave");
		$("#cart > div:last-child").animate({
			height: "toggle",
			opacity: "toggle"
		}, 250, function() {
			bindCartEnter();
			bindCartLeave();
		});
	}

	bindCartLeave = function() {
		$("#cart").on("mouseleave", function() {
			cartTimeout = setTimeout(function() {
				cartMouseToggle();
			}, 250);
		});
	}

	bindCartEnter = function() {
		$("#cart").on("mouseenter", function() {
			if($("#cart > div:last-child:visible").length == 0) {
				cartMouseToggle();
			} else {
				clearTimeout(cartTimeout);
			}
		});
	}

	bindCartEnter();
	bindCartLeave();
}

$(document).ready(function() {
	var loc = localStorage.getItem("locale");
	if(loc === null) {
		localStorage.setItem("locale", "fr");
	}
	
	common.getLocale(localStorage.getItem("locale"))
	.then(response => {
		if(response.msg === messages.GET_LOCALE_CONTENT_SUCCESS) {
			var locale = response.payload.content;
			
			getScript(locale, function() {
				$("body").fadeIn(200);
			});
			
			window.addEventListener("popstate", function() {
				$("#content").fadeOut(200, function() {
					common.changePage(function() {
						getScript(locale, function() {
							$("#content").fadeIn(200);
						});
					});
				});
			});
			document.addEventListener("click", function(e) {
				var el = e.target;
		
				while(el && !el.href) {
					el = el.parentNode;
				}
		
				if(el) {
					e.preventDefault();
					if($(el).attr("href") != "") {
						history.pushState(null, null, el.href);
						$("#content").fadeOut(200, function() {
							common.changePage(function() {
								getScript(locale, function() {
									$("#content").fadeIn(200);
								});
							});
						});
					}
					return;
				}
			});
			
			initLogEvents();
			initCartEvents();
			
			common.fillLocaleValues(locale);
			common.initSubMenus;
			common.initMenuLinks(function() {
				getScript(locale);
			});
		
			return locale
		}
	});
});
