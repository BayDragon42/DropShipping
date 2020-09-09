const logsHandler = require("../logs/logs_handler.js");
const messages = require("./requests_messages.js");
const users = require("../users/user_handler.js");
var usersHandler = new users();

const moment = require("moment");
const jwt = require("jwt-simple");
const fs = require("fs");
const path = require("path");

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
					
					usersHandler.addUser(token, credentials.user_id, session, expires);
					
					logsHandler.log("User '" + credentials.user_id + "' logged in.");
					callback({
						msg: messages.LOGIN_SUCCESS,
						payload: {
							token: token,
							expires: expires
						}
					});
				} else {
					logsHandler.log("User '" + credentials.user_id + "' tried to log in.");
					callback({
						msg: messages.LOGIN_PASSWORD_ERROR,
						payload: {
							token: token,
							expires: expires
						}
					});
				}
			} else {
				callback({
					msg: messages.LOGIN_USERNAME_ERROR,
					payload: {
						token: token,
						expires: expires
					}
				});
			}
		});
	}

	verifyCredentials(token, callback) {
		if(token) {
			var user = usersHandler.findUser(token);
			if(user != undefined) {
				if(!user.isExpired() && user.token == token) {
					callback(messages.VERIFY_CREDENTIALS_SUCCESS);
				} else {
					logsHandler.log("Token '" + token + "' has expired");
					callback({
						msg: messages.VERIFY_CREDENTIALS_ERROR,
						err: "Token has expired"
					});
				}
			} else {
				logsHandler.log("Token '" + token + "' not registered");
				callback({
					msg: messages.VERIFY_CREDENTIALS_ERROR,
					err: "User not found"
				});
			}
		} else {
			callback({
				msg: messages.VERIFY_CREDENTIALS_ERROR,
				err: "Token is undefined"
			});
		}
	}
	
	keepAlive(token, callback) {
		var user = usersHandler.findUser(token);
		if(user != undefined) {
			var expires = moment().add(10, "minutes").valueOf();
			
			user.setExpire(expires);
			
			callback({
				msg: messages.SESSION_KEEP_ALIVE_SUCCESS,
				payload: {
					token: token
				}
			});
		} else {
			callback({
				msg: messages.SESSION_KEEP_ALIVE_ERROR,
				err: "token session not found"
			});
		}
	}
	
	getFilesFromPath(dir, callback) {
		fs.readdir(path.join(__dirname.split("/").slice(0, -1).join("/"), dir), function(err, files) {
			if(!err) {
				callback({
					msg: messages.GET_FILES_FROM_PATH_SUCCESS,
					payload: {
						files: files.map(x => x.split(".")[0])
					}
				});
			} else {
				callback({
					msg: messages.GET_FILES_FROM_PATH_ERROR,
					payload: {
						err: err
					}
				});
			}
		});
	}
	
	getFileContent(pth, callback) {
		fs.readFile(path.join(__dirname.split("/").slice(0, -1).join("/"), pth + ".json"), function(err, data) {
			if(!err) {
				callback({
					msg: messages.GET_FILE_CONTENT_SUCCESS,
					payload: {
						content: JSON.parse(data)
					}
				})
			} else {
				callback({
					msg: messages.GET_FILE_CONTENT_ERROR,
					payload: {
						err: err
					}
				})
			}
		});
	}
  
	parseRequest(content, callback) {
		switch(content.msg) {
			case messages.LOGIN_REQUEST:
				this.authentificateUser(content.payload.session, content.payload.credentials, function(result) {
					callback(result);
				});
				break;
			
			case messages.VERIFY_CREDENTIALS_REQUEST:
				this.verifyCredentials(content.token, function(result) {
					callback(result);
				});
				break;
			
			case messages.SESSION_KEEP_ALIVE_REQUEST:
				this.keepAlive(content.payload.token, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_FILES_FROM_PATH_REQUEST:
				this.getFilesFromPath(content.payload.dir, function(result) {
					callback(result);
				});
				break;
			
			case messages.GET_FILE_CONTENT_REQUEST:
				this.getFileContent(content.payload.pth, function(result) {
					callback(result);
				});
				break;
		}

		return content;
	}
}

module.exports = Requests;
