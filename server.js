const port = 8080;
const hostname = "localhost";

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const compression = require("compression");

const server = express();

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


server.use(compression());
server.use(express.static(path.join(__dirname, 'public')), (req, res) => {
	res.redirect("/");
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
