
// Server configuration
const minimist = require("minimist");
let args = minimist(process.argv.slice(2), {
	alias: {
		p: "port",
		h: "host",
		m: "mode"
	},
	default: {
		host: "localhost",
		port: 8080,
		mode: 0
	}
});

// Local modules require's
const messages = require("./server/requests/requests_messages.js");


// Handlers
const lg = require("./server/logs/logs_handler.js");
var logHandler = new lg(args.mode);
const db = require("./server/databases/database_handler.js");
var dbHandler = new db(logHandler);
const request = require("./server/requests/requests_handler.js");
var requestHandler = new request(dbHandler, logHandler);

// NPM require's
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");
const qs = require("querystring");
const fs = require("fs");

const jsdom = require("jsdom");
const dom = new jsdom.JSDOM();
const window = dom.window;
const document = dom.document

const $ = require("jquery")(window);

const server = express();

server.use(compression());
server.use(cookie());
server.use(bodyParser.json({limit: "25mb"}));
server.use(bodyParser.urlencoded({limit: "25mb", extended: true}));

server.set("view options", {layout: false});
server.engine("html", ejs.renderFile);
server.set("view engine", "html");
server.set("views", __dirname + "/public");

server.get("/", (req, res) => {
	requestHandler.getMenu(1, function(data) {
		res.render("index", {menusItem: JSON.stringify(data)});
	});
});

server.get("/products", (req, res) => {
	// If access via inner link
	if(req.headers.xpjax) {
		res.end();
	} else {
		requestHandler.getMenu(1, function(data) {
			res.render("index", {menusItem: JSON.stringify(data)});
		});
	}
});

server.get("/manage", (req, res) => {
	var token = req.cookies["x-access-token"];
	if(token != undefined) {
		requestHandler.parseRequest(messages.VERIFY_CREDENTIALS_REQUEST, {
			token: token
		}, function(result) {
			if(result === messages.VERIFY_CREDENTIALS_SUCCESS) {
				// If access via inner link
				if(req.headers.xpjax) {
					res.end();
				} else {
					requestHandler.getMenu(0, function(data) {
						res.render("index", {menusItem: JSON.stringify(data)});
					});
				}
			} else {
				res.cookie("x-access-token", token, {
					maxAge: 0,
					httpOnly: true
				});
				res.redirect("/manage");
			}
		});
	} else {
		if(req.cookies["r"]) {
			requestHandler.getMenu(1, function(data) {
				res.render("index", {menusItem: JSON.stringify(data)});
			});
		} else {
			res.cookie("r", true, {
				maxAge: 1000,
				httpOnly: true
			});
			res.redirect("/manage");
		}
	}
	
});

server.post("/req", (req, res) => {
	requestHandler.parseRequest(req.body.msg, req.body.payload, function(result) {
		if (result.msg === messages.LOGIN_SUCCESS || result.msg === messages.PARTNER_LOGIN_SUCCESS || result.msg === messages.SESSION_KEEP_ALIVE_SUCCESS) {
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

server.listen(args.port, args.host, () => {
	logHandler.log(`Server running at http://${args.host}:${args.port}/`);
});
