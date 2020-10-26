const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

class DBHandler {
	constructor() {
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
				console.log(`${err.message} : Error`);
			}
		})
	}
	
	query(query, callback) {
		console.log(query);
		//var con = this.openConnexion();
		
		this.con.query(query, function(err, result) {
			if(err) {
				if(err.errno == 1049) {
					console.log(`${err.sqlMessage} : Failed to connect MySql database`);
				} else {
					console.log(`${err.sqlMessage} : Mysql Database connection error`);
				}
			} else {
				callback(result);
			}
		});
		
		//this.closeConnexion(con);
	}
}

module.exports = DBHandler;
