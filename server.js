const port = 8080;
const hostname = "192.168.2.12";

// Local modules require's
const messages = require("./server/requests/requests_messages.js");


// Handlers
const logsHandler = require("./server/logs/logs_handler.js");
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
const qs = require("querystring");

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
	res.render("index");
});

server.get("/test", (req, res) => {
	res.render("manage/localeConfig");
});

server.get("/manage", (req, res) => {
	var token = req.cookies["x-access-token"];	
	if(token != undefined) {
		requestHandler.parseRequest({
			msg: messages.VERIFY_CREDENTIALS_REQUEST,
			token: token
		}, function(result) {
			if(result === messages.VERIFY_CREDENTIALS_SUCCESS) {
				switch(qs.parse(req.query)["page"]) {
					case "stats":
						res.render("manage/stats");
						break;
					
					case "visits":
						res.render("manage/visits");
						break;
					
					case "commands":
						res.render("manage/commands");
						break;
					
					case "productsstats":
						res.render("manage/visitedProducts");
						break;
					
					case "products":
						res.render("manage/products");
						break;
					
					case "users":
						res.render("manage/users");
						break;
					
					case "productsconfig":
						res.render("manage/productsConfig");
						break;
					
					case "locale":
						res.render("manage/localeConfig");
						break;
					
					default:
						res.render("manage/stats");
				}
			} else {
				res.render("manage");
			}
		});
	} else {
		res.render("manage");
	}
	
});

server.post("/req", (req, res) => {
	requestHandler.parseRequest(req.body, function(result) {
		if (result.msg === messages.LOGIN_SUCCESS || result.msg === messages.SESSION_KEEP_ALIVE_SUCCESS) {
			res.cookie("x-access-token", result.payload.token, {
				maxAge: 1000 * 60 * 10,
				httpOnly: true
			});
		}
		res.send(JSON.stringify(result));
	});
});

server.use(express.static(path.join(__dirname, 'public')), (req, res) => {
	res.redirect("/");
});

server.listen(port, hostname, () => {
	logsHandler.log(`Server running at http://${hostname}:${port}/`);
});
