const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

class DBHandler {
	constructor() {
		this.con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "admin",
			port: 3380
		});
		this.db = "mydb";
		
		this.con.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
		});
		
		this.con.query(`USE ${this.db}`, function (err, result) {
			if (err) {
				if (err.errno == 1049) {
					console.log(`${err.sqlMessage} : Failed to connect MySql database`);
				} else {
					console.log(`${err.sqlMessage} : Mysql Database connection error`);
				}
			}
		});
	}
	
	select(columns, table, where, callback) {
		if(where != undefined) {
			console.log(`SELECT ${columns} FROM ${table} WHERE ${where}`);
			this.con.query(`SELECT ${columns} FROM ${table} WHERE ${where}`, function (err, result) {
				if (err) {
					if (err.errno == 1049) {
						console.log(`${err.sqlMessage} : Failed to connect MySql database`);
					} else {
						console.log(`${err.sqlMessage} : Mysql Database connection error`);
					}
				} else {
					callback(result);
				}
			});
		} else {
			console.log(`SELECT ${columns} FROM ${table}`);
			this.con.query(`SELECT ${columns} FROM ${table} WHERE ${where}`, function (err, result) {
				if (err) {
					if (err.errno == 1049) {
						console.log(`${err.sqlMessage} : Failed to connect MySql database`);
					} else {
						console.log(`${err.sqlMessage} : Mysql Database connection error`);
					}
				} else {
					callback(result);
				}
			});
		}
	}
}

module.exports = DBHandler;
