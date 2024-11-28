import net from "node:net"

const port = 10001;
const host = '127.0.0.1';

let connected = false

const server = net.createServer()

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
				console.log("rx")
				sock.write("r,-09.42m,0000005915Hz,0000000000c,0000000.000s, 027.0C")
				break
			case "q!":
				console.log("q!")
				sock.end()
				break
		}
		console.log('received data: ' + data.toString().trim())
	})

	sock.on("end", () => connected = false)
})
