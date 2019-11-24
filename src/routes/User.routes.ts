import { Application } from 'express'

import { UserController } from '../controllers/Index'
import { jwtAuth } from '../validation/Auth.validation'
import {
	createUserRules,
	deleteUserRules,
	getAllUsersRules,
	getUserByIdRules,
	getUserEventsRules,
	getUserFamilyRules,
	updateUserRules
} from '../validation/User.validation'
import validate from '../validation/Validator'

class UserRoutes {
	private userController: UserController = new UserController()

	public routes(app: Application): void {
		app.route('/user')
			.post(createUserRules(), validate, this.userController.createUser)
			.get(getAllUsersRules(), validate, this.userController.getAllUsers)

		app.route('/user/:userId')
			.get(getUserByIdRules(), validate, this.userController.getUserById)
			.patch(updateUserRules(), validate, this.userController.updateUser)
			.delete(deleteUserRules(), validate, this.userController.deleteUser)

		app.get(
			'/user/:userId/family',
			getUserFamilyRules(),
			validate,
			this.userController.getUserFamily
		)

		app.get(
			'/user/:userId/events',
			jwtAuth,
			getUserEventsRules(),
			validate,
			this.userController.getUserEvents
		)
	}
}

export default UserRoutes
