const fs = require("fs");
const path = require("path");

class LogHandler {
	constructor(mode) {
		this.mode = mode || 0;
	}
	
	logToFile(date, time, value) {
		const filePath = path.join("./logs", date.split("/").join("_") + ".log");
	
		if(fs.existsSync(filePath)) {
			fs.appendFile(filePath, date + " " + time + " - " + value, function(err) {
				if(err) {
					console.log(err);
				}
			});
		} else {
			fs.writeFile(filePath, date + " " + time + " - " + value, function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
	}
	
	log(value) {
		var d = new Date(Date.now());
		var date = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth()+1).padStart(2, "0") + "/" + d.getFullYear();
		var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
	
		this.logToFile(date, time, value);
		console.log(date + " " + time + " - " + value);
	}
	
	debug(value) {
		if(this.mode == 1) {
			var d = new Date(Date.now());
			var date = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth()+1).padStart(2, "0") + "/" + d.getFullYear();
			var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
		
			console.log(date + " " + time + " - " + value);
		}
	}
}

module.exports = LogHandler;
/*

function logToFile(date, time, value) {
	const filePath = path.join("./logs", date.split("/").join("_") + ".log");
	
	if(fs.existsSync(filePath)) {
		fs.appendFile(filePath, date + " " + time + " - " + value, function(err) {
			if(err) {
				console.log(err);
			}
		});
	} else {
		fs.writeFile(filePath, date + " " + time + " - " + value, function(err) {
			if(err) {
				console.log(err);
			}
		});
	}
}

module.exports = {
	log: function(value) {
		var d = new Date(Date.now());
		var date = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth()+1).padStart(2, "0") + "/" + d.getFullYear();
		var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
		
		logToFile(date, time, value);
		console.log(date + " " + time + " - " + value);
	},
	debug: function(value) {
		if(mode == 1) {
			var d = new Date(Date.now());
			var date = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth()+1).padStart(2, "0") + "/" + d.getFullYear();
			var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
		
			console.log(date + " " + time + " - " + value);
		}
	},
	setMode: function(m) {
		mode = m;
	}
};
*/
