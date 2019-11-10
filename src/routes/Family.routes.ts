import { Application } from 'express'
import { FamilyController } from '../controllers/index'

class UserRoutes {
	private familyController: FamilyController = new FamilyController()

	public routes(app: Application): void {
		app.route('/family').post(this.familyController.createFamily)

		app.route('/family/:familyId')
			.get(this.familyController.getFamilyById)
			.patch(this.familyController.updateFamily)
			.delete(this.familyController.deleteFamily)
	}
}

export default UserRoutes
