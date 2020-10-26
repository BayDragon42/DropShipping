import common from "./common_script.js"
import messages from "./messages.js"

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
	var loc = localStorage.getItem("locale");
	if(loc === null) {
		localStorage.setItem("locale", "fr");
	}
	
	common.getLocale(localStorage.getItem("locale"))
	.then(response => {
		if(response.msg === messages.GET_LOCALE_CONTENT_SUCCESS) {
			var locale = response.payload.content;
			
			common.fillLocaleValues(locale);		
			common.initSubMenus;
			common.initMenuLinks;
		
			// Page specific script
			console.log("ok");
		}
	});
});
