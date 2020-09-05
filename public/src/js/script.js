import messages from "./messages.js"

$(document).ready(function() {
	/*
	$.ajax({
		type: "POST",
		url: "req",
		contentType: "application/json",
		data: JSON.stringify({
			msg: messages.VERIFY_CREDENTIALS_REQUEST,
			payload: {
				credential: window.localStorage.getItem("token")
			}
		})
	});
	*/
	
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
			
			location.reload();
		})
		.fail((data) => {
			console.err("failed");
		});
	});
});
