const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

class DBHandler {
	constructor(logHandler) {
		this.logHandler = logHandler;
		this.db = "mydb";
	 	this.con = mysql.createPool({
	 		connectionLimit: 10,
			host: "localhost",
			user: "root",
			password: "admin",
			port: 3380,
			database: this.db
		});
	}
	
	openConnexion() {
	 	var con = mysql.createPool({
	 		connectionLimit: 10,
			host: "localhost",
			user: "root",
			password: "admin",
			port: 3380,
			database: this.db
		});
		
		return con;
	}
	
	closeConnexion(con) {
		con.end(function(err) {
			if(err) {
				this.logHandler.debug(`${err.message} : Error`);
			}
		})
	}
	
	query(query, callback, array) {
		var t = this;
		this.logHandler.debug(query);
		//var con = this.openConnexion();
		
		if(array === undefined) {
			this.con.query(query, function(err, result) {
				if(err) {
					if(err.errno == 1049) {
						t.logHandler.debug(`${err} : Failed to connect MySql database`);
					} else {
						t.logHandler.debug(`${err} : Mysql Database connection error`);
					}
				} else {
					callback(result);
				}
			});
		} else {
			this.con.query(query, array, function(err, result) {
				if(err) {
					if(err.errno == 1049) {
						t.logHandler.debug(`${err} : Failed to connect MySql database`);
					} else {
						t.logHandler.debug(`${err} : Mysql Database connection error`);
					}
				} else {
					callback(result);
				}
			});
		}
		
		//this.closeConnexion(con);
	}
}

module.exports = DBHandler;
