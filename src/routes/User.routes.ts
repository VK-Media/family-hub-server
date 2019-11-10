import { Application } from 'express'
import { UserController } from '../controllers/index'

class UserRoutes {
	private userController: UserController = new UserController()

	public routes(app: Application): void {
		app.route('/user').post(this.userController.addNewUser)

		app.route('/user/:userId')
			.get(this.userController.getUserById)
			.patch(this.userController.updateUser)
			.delete(this.userController.deleteUser)
	}
}

export default UserRoutes
