const fs      = require("fs"),
	babel     = require("@babel/core"),
	path      = require('path')
var last_state = fs.existsSync("build_state.json") ? JSON.parse(fs.readFileSync("build_state.json")) : {},
	cur_state = {}

function ChangeDir(file) {
	var split = path.normalize(file).split(path.sep)
	split[split.length - 3] = "src_compiled"
	return split.join(path.sep)
}

/**
 * @returns was file changed?
 */
function UodateState(file, stats) {
	if(last_state[file] === undefined || last_state[file] !== stats.mtimeMs) {
		cur_state[file] = stats.mtimeMs
		return true
	}
	return false
}

function AbstractPath(file, depth = 2) {
	if(depth === 1)
		return path.basename(file)
	return file.split(path.sep).slice(-depth).join(path.sep)
}

function Handle(file = "src", callback) {
	fs.stat(file, (err, stats) => {
		if(err) throw err
		if(stats.isDirectory())
			fs.readdir(file, (err, files) => {
				if(err) throw err
				files.forEach(subFile => Handle(`${file}/${subFile}`))
			})
		else {
			if(!UodateState(file, stats))
				return
			var changed = ChangeDir(file)
			if(!fs.existsSync(path.dirname(changed)))
				fs.mkdirSync(path.dirname(changed))
			if(/^.*\.(t|j)s$/.test(file)) {
				changed = `${/^(.*)\.(t|j)s$/.exec(changed)[1]}.js`
				console.log(`Recompiling ${path.basename(path.dirname(file))}/${path.basename(file)}`)
				fs.writeFileSync(changed, babel.transformFileSync(file, {
					filename: path.basename(path.dirname(file)),
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
				}).code)
			} else if(!/^.*\.(conf|xml|conf\.custom)$/.test(file)) {
				console.log(`Copying ${AbstractPath(file)}`)
				fs.copyFileSync(file, changed)
			}
		}
	})
}

function DeleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(file => {
			var curPath = `${path}/${file}`
			if (fs.lstatSync(curPath).isDirectory())
				DeleteFolderRecursive(curPath)
			else
				fs.unlinkSync(curPath)
			})
		fs.rmdirSync(path)
	}
}

if(!fs.existsSync("build_state.json") && fs.existsSync("src_compiled"))
	DeleteFolderRecursive("src_compiled")
if(!fs.existsSync("src_compiled")) {
	if(fs.existsSync("build_state.json"))
		fs.unlinkSync("build_state.json")
	last_state = {}
	fs.mkdirSync("src_compiled")
}
Handle()
process.on('exit', () => {
	Object.entries(last_state).forEach(([file, time]) => {
		let file_changed = ChangeDir(file)
		if(/^.*\.(t|j)s$/.test(file))
			file_changed = `${/^(.*)\.(t|j)s$/.exec(ChangeDir(file))[1]}.js`
		if(!fs.existsSync(file)) {
			console.log(`Deleting removed file [${file.substring(4)}] from src_compiled...`)
			fs.unlinkSync(file_changed)
			{ // remove empty dirs too
				var base_dir = path.normalize(file).split(path.sep)
				--base_dir.length
				var old_dir = base_dir.join(path.sep)
				base_dir[base_dir.length - 2] = "src_compiled"
				var new_dir = base_dir.join(path.sep)
				if(!fs.existsSync(old_dir) && fs.existsSync(new_dir) && fs.readdirSync(new_dir).length === 0) fs.rmdirSync(new_dir)
			}
		} else
			if(cur_state[file] === undefined)
				cur_state[file] = time
	})
	fs.writeFileSync("build_state.json", JSON.stringify(cur_state))
})