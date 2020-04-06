const { ScriptCache, DataCache } = require("./cache"),
	path 						 = require('path')
var isPrivate = true,
	scriptCache, dataCache

var api = {
	"getinitscript": (req, res) => scriptCache.GetEntry("init/body.js").then(data => {
		res.setHeader("Content-Type", "application/javascript")
		res.send(data)
	}),
	"getscript": (req, res, data) => {
		scriptCache.HasEntry(`${data.path}.js`).then(exists =>
			scriptCache.GetEntry(!exists && path.basename(data.path) === "body" ? `${path.dirname(data.path)}/__init__.js`  : `${data.path}.js`).then(data => {
				res.setHeader("Content-Type", "application/javascript")
				res.send(data)
			})
		)
	},
	"getxml": (req, res, data) => dataCache.GetEntry(`${data.path}.xml`).then(data => {
		res.setHeader("Content-Type", "application/xml")
		res.send(data)
	}),
	"getconfig": (req, res, data) => dataCache.HasEntry(`${data.path}/config.conf.${isPrivate ? "custom"  : data.steamid}`).then(flag =>
		dataCache.GetEntry(`${data.path}/config.conf${flag ? `.${isPrivate ? "custom" : data.steamid}`  : ""}`).then(data => {
			res.setHeader("Content-Type", "application/json")
			res.send(data)
		})
	),
	"writeconfig": (req, res, data) => dataCache.SetEntry(`${data.path}/config.conf.${isPrivate ? "custom"  : data.steamid}`, JSON.stringify(data.data)).then(() => res.sendStatus(200)),
	"scriptlist": (req, res) => scriptCache.GetEntryKeyList().then(data => {
		res.setHeader("Content-Type", "application/json")
		data.splice(data.indexOf("init"), 1)
		data.splice(data.indexOf("gui"), 1)
		data.splice(data.indexOf("utils"), 1)
		data.unshift("utils")
		res.send(data)
	}),
	"log": (req, res, data) => {
		var report = {
			steamid: data.steamid,
			script: data.path,
			msg: data.data
		}
		console.log(`[${report.steamid}] [${report.script}] ${report.msg}`)
		res.sendStatus(200)
	}
}

function secure(data) {
	if(data.steamid && !/^[0-9]{17}$/.test(data.steamid))
		throw "Invalid SteamID"

	data.path = (data.path || "").replace(/\\/g, "/").replace(/(?:\/)+/g, "/").replace(/(?:\.)+/g, ".")
	return data
}

function HandleAPI(req, res) {
	var data = secure(req.body)
	if(!data.name || data.name === "") {
		res.sendStatus(400)
		return
	}

	var callback = api[data.name]
	try {
		if(callback)
			callback(req, res, data)
		else
			res.sendStatus(404)
	} catch(e) {
		res.status(503).send(JSON.stringify(e))
	}
}

module.exports = () => {
	scriptCache = new ScriptCache()
	dataCache = new DataCache()

	return HandleAPI
}