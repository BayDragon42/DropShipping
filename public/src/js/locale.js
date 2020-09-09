import messages from "./messages.js"

function l() {
	const url = "req";
	const headers = new Headers({
		"Content-Type": "application/json"
	});
	
	return fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify({
			msg: messages.GET_FILE_CONTENT_REQUEST,
			payload: {
				pth: "localisation/" + localStorage.getItem("locale")
			}
		})
	})
	.then(response => {
		if(response.status === 200) {
			return response.json();
		}
	})
}

export {l}
