import net from "node:net"

const port = 10001;
const host = '127.0.0.1';

let connected = false

const server = net.createServer()
let startTime = new Date()

server.listen(port, host, () => {
	console.log(`server is listening on ${host}:${port}`)
})

server.on("connection", sock => {
	if (connected) return sock.end()
	connected = true
	console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
	sock.on("data", data => {
		switch (data.toString().trim()) {
			case "rx":
				sock.write(generateRandomizedResponse())
				break
			case "q!":
				sock.end()
				break
		}
		console.log('received data: ' + data.toString().trim())
	})

	sock.on("end", () => connected = false)
})

function generateRandomizedResponse() {
	const length = ((Math.random() * 20) - 10).toFixed(2) + "m"
	const frequency = "000000" + Math.floor((Math.random() * 10000)) + "Hz"
	const c = "00000000" + Math.floor(Math.random() * 99) + "c"
	const timeElapsedMs = new Date().getTime() - startTime.getTime()
	const t = (timeElapsedMs / 1000).toFixed(3) + "s"
	const temperature = "0" + Math.floor(Math.random() * 30).toFixed(1) + "C"
	return ["r", length, frequency, c, t, temperature].join(",")
}
