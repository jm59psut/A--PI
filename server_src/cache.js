const fs      = require("fs"),
	devServer = fs.existsSync("devServer") || fs.existsSync("server_src/devServer")

class Cache {
	HasEntry(tableName, name) {
		return new Promise(accept => fs.exists(`${tableName}/${name}`, accept))
	}

	GetEntry(tableName, name) {
		return new Promise((accept, reject) => fs.readFile(`${tableName}/${name}`, (err, data) => {
			if(err) reject(err)
			else accept(data)
		}))
	}

	SetEntry(tableName, name, data) {
		return new Promise((accept, reject) => fs.writeFile(`${tableName}/${name}`, data, err => {
			if(err) reject(err)
			else accept()
		}))
	}

	GetEntryKeyList(tableName) {
		return new Promise((accept, reject) => fs.readdir(tableName, (err, files) => {
			if(err) reject(err)
			else accept(files)
		}))
	}
}

if(devServer)
	var babel = require("@babel/core")
class ScriptCache extends Cache {
	HasEntry(name) {
		name = devServer ? `${/(.*).(t|j)s/.exec(name)[1]}.ts` : name
		return super.HasEntry(devServer ? "src" : "src_compiled", name)
	}

	GetEntry(name) {
		name = devServer ? `${/(.*).(t|j)s/.exec(name)[1]}.ts` : name
		var promise = super.GetEntry(devServer ? "src" : "src_compiled", name)
		if(devServer) {
			if(this.dev_script_cache === undefined)
				this.dev_script_cache = {}
			var timestamp = fs.statSync(name).mtimeMs
			if(dev_script_cache[name] != undefined && dev_script_cache[name].timestamp === timestamp)
				return new Promise(accept => accept(dev_script_cache[name].code))

			return promise.then(code => {
				var code = babel.transform(code, {
					filename: name,
					retainLines: false,
					comments: false,
					compact: true,
					presets: [
						["@babel/preset-env", {
							loose: true,
							modules: false
						}],
						"@babel/preset-typescript",
						"minify"
					],
					plugins: [
						"@babel/plugin-proposal-class-properties"
					]
				}).code
				this.dev_script_cache[name] = {
					"code": code,
					"timestamp": timestamp
				}
			})
		}
		return promise
	}

	SetEntry() {}

	GetEntryKeyList() {
		return super.GetEntryKeyList(devServer ? "src" : "src_compiled")
	}
}

class DataCache extends Cache {
	HasEntry(name) {
		return super.HasEntry(/*"data"*/ "src", name)
	}

	GetEntry(name) {
		return super.GetEntry(/*"data"*/ "src", name)
	}

	SetEntry(name, data) {
		return super.SetEntry(/*"data"*/ "src", name, data)
	}

	GetEntryKeyList() {
		return super.GetEntryKeyList(/*"data"*/ "src")
	}
}

module.exports = { Cache, ScriptCache, DataCache }
