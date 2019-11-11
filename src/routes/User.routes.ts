import { Application } from 'express'

import { UserController } from '../controllers/Index'
import {
	createUserRules,
	deleteUserRules,
	getUserByIdRules,
	updateUserRules
} from '../validation/User.validation'
import validate from '../validation/Validator'

class UserRoutes {
	private userController: UserController = new UserController()

	public routes(app: Application): void {
		app.route('/user')
			.post(createUserRules(), validate, this.userController.createUser)
			.get(this.userController.getAllUsers)

		app.route('/user/:userId')
			.get(getUserByIdRules(), validate, this.userController.getUserById)
			.patch(updateUserRules(), validate, this.userController.updateUser)
			.delete(deleteUserRules(), validate, this.userController.deleteUser)
	}
}

export default UserRoutes
