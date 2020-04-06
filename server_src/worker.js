const express    = require('express'),
	bodyParser   = require('body-parser'),
	app 		 = express()

module.exports = class Worker {
	constructor() {
		app.use(bodyParser.urlencoded({ extended: true }))
		app.post("/", require("./api")())
		app.listen(4297)
	}
}