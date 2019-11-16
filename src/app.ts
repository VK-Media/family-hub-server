import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import { connect } from 'mongoose'

import {
	EventRoutes,
	FamilyRoutes,
	RecipeRoutes,
	UserRoutes
} from './routes/Index'
import socketServer from './SocketServer'

class App {
	public app: express.Application
	public mongoUrl: string = process.env.MONGODB_URL
	public userRoutes: UserRoutes = new UserRoutes()
	public familyRoutes: FamilyRoutes = new FamilyRoutes()
	public eventRoutes: EventRoutes = new EventRoutes()
	public recipeRoutes: RecipeRoutes = new RecipeRoutes()

	constructor() {
		this.app = express()
		socketServer.createServer(this.app)
		this.config()
		this.mongoSetup()

		this.userRoutes.routes(this.app)
		this.familyRoutes.routes(this.app)
		this.eventRoutes.routes(this.app)
		this.recipeRoutes.routes(this.app)

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
		// this.app.use((req, res, next) => {
		// 	res.header('Access-Control-Allow-Origin', '*')
		// 	res.header(
		// 		'Access-Control-Allow-Headers',
		// 		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		// 	)
		// 	res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
		// 	next()
		// })
	}

	private mongoSetup(): void {
		connect(this.mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
	}
}

export default new App().app
