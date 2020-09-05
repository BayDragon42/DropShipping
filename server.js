const port = 8080;
const hostname = "192.168.2.12";

// Local modules require's
const messages = require("./server/requests/requests_messages.js");

// Handlers
const db = require("./server/databases/database_handler.js");
var dbHandler = new db();
const request = require("./server/requests/requests_handler.js");
var requestHandler = new request(dbHandler);

// NPM require's
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");

const server = express();

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(compression());
server.use(cookie());

server.set("view options", {layout: false});
server.engine("html", ejs.renderFile);
server.set("view engine", "html");
server.set("views", __dirname + "/public");

server.get("/", (req, res) => {
	res.render("index", {
		title: "Index"
	});
});

server.get("/subpage", (req, res) => {
	res.render("subpage", {
		title: "Subpage"
	});
});

server.get("/manage", (req, res) => {
	var tkn = req.cookies["x-access-token"];
	requestHandler.parseRequest({
		msg: messages.VERIFY_CREDENTIALS_REQUEST,
		payload: {
			token: tkn
		}
	}, function(result) {
		console.log(result);
		if(result === true) {
			res.render("subpage", {
				title: "Subpage"
			});
		} else {
			res.render("manage", {
				title: "Manage"
			});
		}
	});
	
});

server.post("/req", (req, res) => {
	requestHandler.parseRequest(req.body, function(result) {
		if (result.msg === messages.LOGIN_SUCCESS) {
			res.cookie("x-access-token", result.payload.token, {
				maxAge: 1000 * 60 * 10
			});
			res.end(JSON.stringify(result));
		}
	});
});

server.use(express.static(path.join(__dirname, 'public')), (req, res) => {
	res.redirect("/");
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
