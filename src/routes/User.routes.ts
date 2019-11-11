import { Application } from 'express'

import { UserController } from '../controllers/index'
import {
	createUserRules,
	getUserByIdRules
} from '../validation/user_validation/user.validation'
import validate from '../validation/validator'

class UserRoutes {
	private userController: UserController = new UserController()

	public routes(app: Application): void {
		app.route('/user').post(
			createUserRules(),
			validate,
			this.userController.createUser
		)

		app.route('/user/:userId')
			.get(getUserByIdRules(), validate, this.userController.getUserById)
			.patch(this.userController.updateUser)
			.delete(this.userController.deleteUser)
	}
}

export default UserRoutes
