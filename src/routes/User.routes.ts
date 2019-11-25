import { Application } from 'express'

import { UserController } from '../controllers/Index'
import { jwtAuth } from '../validation/Auth.validation'
import {
	createUserRules,
	getAllUsersRules,
	updateUserRules
} from '../validation/User.validation'
import validate from '../validation/Validator'

class UserRoutes {
	private userController: UserController = new UserController()

	public routes(app: Application): void {
		app.route('/user')
			.post(createUserRules(), validate, this.userController.createUser)
			.get(jwtAuth, this.userController.getUserById)
			.patch(
				jwtAuth,
				updateUserRules(),
				validate,
				this.userController.updateUser
			)
			.delete(jwtAuth, this.userController.deleteUser)

		app.route('/users').get(
			getAllUsersRules(),
			validate,
			this.userController.getAllUsers
		)
		app.get('/user/family', jwtAuth, this.userController.getUserFamily)

		app.get('/user/events', jwtAuth, this.userController.getUserEvents)
	}
}

export default UserRoutes
