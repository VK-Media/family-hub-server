import { Application as expressApp } from 'express'
import http from 'http'
import socketio from 'socket.io'

class SocketServer {
	public static server: socketio.Server

	public static createServer(app: expressApp): void {
		const httpServer = http.createServer(app)
		httpServer.listen(process.env.SOCKET_PORT || 8000)
		SocketServer.server = socketio(httpServer)
	}
}

export default SocketServer
