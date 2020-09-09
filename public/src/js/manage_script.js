import messages from "./messages.js"

import {l} from "./locale.js";

var locale;

l()
.then(response => {
	locale = response.payload.content;
});

function fillLocaleValues() {
	console.log("ok");
}

$(document).ready(function() {
	fillLocaleValues();
});
