import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import AuthRoutes from './routes/Auth.routes'
import {
	EventRoutes,
	FamilyRoutes,
	RecipeRoutes,
	UserRoutes
} from './routes/Index'
import socketServer from './SocketServer'

class App {
	public expressApp: express.Application
	public userRoutes: UserRoutes = new UserRoutes()
	public familyRoutes: FamilyRoutes = new FamilyRoutes()
	public eventRoutes: EventRoutes = new EventRoutes()
	public recipeRoutes: RecipeRoutes = new RecipeRoutes()
	public authRoutes: AuthRoutes = new AuthRoutes()

	constructor() {
		if (process.env.NODE_ENV !== 'production') {
			require('dotenv').config()
		}

		this.expressApp = express()
		this.createSocketIOServer()
		this.config()
		this.databaseSetup()

		this.userRoutes.routes(this.expressApp)
		this.familyRoutes.routes(this.expressApp)
		this.eventRoutes.routes(this.expressApp)
		this.recipeRoutes.routes(this.expressApp)
		this.authRoutes.routes(this.expressApp)

		this.eventRoutes.realtimeRoutes()
	}

	private config(): void {
		this.expressApp.use(bodyParser.json())
		this.expressApp.use(bodyParser.urlencoded({ extended: false }))
		this.expressApp.use(
			cors({
				origin: 'http://localhost:3000',
				credentials: true
			})
		)
	}

	private createSocketIOServer(): void {
		socketServer.createServer(this.expressApp)
	}
}

const app = new App();
export default app.expressApp
