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
	res.render("index");
	/*
	fs.readFile(path.join(__dirname, '/public/index.html'), function(err, html){
		if(err) {
			console.log(err);
		} else {
			res.set('Content-Type', 'text/html');
			res.end(new Buffer(html));
		}
	});
	*/
});

server.get("/test", (req, res) => {
	res.render("products");
});

server.get("/products", (req, res) => {
	if(req.headers.xpjax) {
		fs.readFile(path.join(__dirname, "public/products.html"), function(err, html){
			if(!err) {
				var doc = $(html.toString("utf-8"));
				var content = $(doc).find("#content");
		
				res.set('Content-Type', 'text/html');
				res.end(content.html());
			} else {
				console.log(err);
			}
		});
	} else {
		res.render("products");
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
					fs.readFile(path.join(__dirname, "public/manage", req.query["page"] + ".html"), function(err, html){
						if(!err) {
							var doc = $(html.toString("utf-8"));
							var content = $(doc).find("#content");
							
							res.set('Content-Type', 'text/html');
							res.end(content.html());
						} else {
							console.log(err);
						}
					});
				} else {
					if(req.query["page"]) {
						res.render("manage/" + req.query["page"]);
					} else {
						res.render("manage");
					}
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
		res.render("manage");
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
