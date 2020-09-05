const messages = require("./requests_messages.js");
const users = require("../users/user_handler.js");
var usersHandler = new users();

const moment = require("moment");
const jwt = require("jwt-simple");

const adminPassword = "youkoulélé";
const key = "oMim5OMvkTr-dUMpSfhOvZY-mHcf1UMdVSqJFoM0a4k6HxxiCzT2JRo_kmHRBgT5bk08kvR5ANAhDIvVFkGDq0B82hvGCHHeGaz2XrsJw5o6CUsYdOZeTyjje65zF1HPd6LvSq1rJUX-fW9QrdGOLuojP7arMxKOCRk0qXaiJsk";

class Requests {
	constructor(dbHandler) {
		this.dbHandler = dbHandler;
	}

	authentificateUser(session, credentials, callback) {
		this.dbHandler.select("*", "users", `user_id = "${credentials.user_id}" and session = "${session}"`, function(result) {
			if(result.length != 0) {
				if(credentials.pass === result[0].password) {
					var expires = moment().add(10, "minutes").valueOf();
					var token = jwt.encode({
						user: credentials.user_id,
						pass: credentials.pass,
						session: session,
						exp: expires
					}, key);
					
					usersHandler.addUser(token, credentials.user_id, session, credentials.expire);
					
					callback({
						msg: messages.LOGIN_SUCCESS,
						payload: {
							token: token,
							expires: expires
						}
					});
				} else {
					console.log("wrong password");
				}
			} else {
				console.log("User does not exists");
			}
		});
	}

	verifyCredentials(token, callback) {
		if(token) {
			var user = usersHandler.findUser(token)
			if(user != undefined) {
				if(!user.isExpired() && user.token == token) {
					callback(true);
				}
			}
		}
		
		callback(false);
	}
  
	parseRequest(content, callback) {
		switch(content.msg) {
			case messages.LOGIN_REQUEST:
				this.authentificateUser(content.payload.session, content.payload.credentials, function(result) {
					callback(result);
				});
				break;
			case messages.VERIFY_CREDENTIALS_REQUEST:
				this.verifyCredentials(content.payload.token, function(result) {
					callback(result);
				});
				break;
		}

		return content;
	}
}

module.exports = Requests;
