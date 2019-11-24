import { Application } from 'express'

import { AuthController } from '../controllers/Index'
import { loginRules } from '../validation/Auth.validation'
import validate from '../validation/Validator'

class AuthRoutes {
	private authController: AuthController = new AuthController()

	public routes(app: Application): void {
		app.route('/auth').post(
			loginRules(),
			validate,
			this.authController.login
		)
	}
}

export default AuthRoutes
