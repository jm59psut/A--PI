module.exports = cluster => class Master {
	constructor() {
		this.os      = require("os")
		this.fs      = require("fs")

		this.workers = []
		var self     = this

		for (let i = 0; i < this.os.cpus().length; i++)
			this.ForkWorker()

		cluster.on("exit", function(worker, code) {
			console.log(`[master] Worker ${worker.process.pid} exited with code ${code}, forking new.`)
			self.ForkWorker()
		});
	}

	ForkWorker() {
		var forkedWorker = cluster.fork();
		console.log(`[master] Spawned worker ${forkedWorker.process.pid}`)
	}
}