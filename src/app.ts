import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import { connect } from 'mongoose'

import AuthRoutes from './routes/Auth.routes'
import {
	EventRoutes,
	FamilyRoutes,
	RecipeRoutes,
	UserRoutes
} from './routes/Index'
import socketServer from './SocketServer'

class App {
	public app: express.Application
	public userRoutes: UserRoutes = new UserRoutes()
	public familyRoutes: FamilyRoutes = new FamilyRoutes()
	public eventRoutes: EventRoutes = new EventRoutes()
	public recipeRoutes: RecipeRoutes = new RecipeRoutes()
	public authRoutes: AuthRoutes = new AuthRoutes()

	constructor() {
		if (process.env.NODE_ENV !== 'production') {
			require('dotenv').config()
		}

		this.app = express()
		this.createSocketIOServer()
		this.config()
		this.mongoSetup()

		this.userRoutes.routes(this.app)
		this.familyRoutes.routes(this.app)
		this.eventRoutes.routes(this.app)
		this.recipeRoutes.routes(this.app)
		this.authRoutes.routes(this.app)

		this.eventRoutes.realtimeRoutes()
	}

	private config(): void {
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use(
			cors({
				origin: 'http://localhost:3000',
				credentials: true
			})
		)
	}

	private mongoSetup(): void {
		const nodeEnvironment = process.env.NODE_ENV.toUpperCase()

		const databaseConnectionString =
			process.env['MONGODB_URL_' + nodeEnvironment]

		connect(databaseConnectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
	}

	private createSocketIOServer(): void {
		socketServer.createServer(this.app)
	}
}

export default new App().app
