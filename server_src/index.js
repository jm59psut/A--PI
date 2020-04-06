const cluster = require("cluster");

if(cluster.isMaster) {
	const Master = require("./master")(cluster)
	new Master()
} else {
	const Worker = require("./worker")
	new Worker()
}