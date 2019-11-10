import * as bodyParser from 'body-parser'
import * as express from 'express'
import { connect } from 'mongoose'

import { UserRoutes } from './routes'

class App {
	public app: express.Application
	public mongoUrl: string = process.env.MONGODB_URL
	public userRoutes: UserRoutes = new UserRoutes()

	constructor() {
		this.app = express()
		this.config()
		this.mongoSetup()
		this.userRoutes.routes(this.app)
	}

	private config(): void {
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept, Authorization'
			)
			res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
			next()
		})
	}

	private mongoSetup(): void {
		connect(this.mongoUrl, { useNewUrlParser: true })
	}
}

export default new App().app
