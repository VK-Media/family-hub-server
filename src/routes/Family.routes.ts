import { Application } from 'express'

import { FamilyController } from '../controllers/Index'
import { jwtAuth } from '../validation/Auth.validation'
import {
	createFamilyRules,
	deleteFamilyByIdRules,
	getFamilyByIdRules,
	updateFamilyRules
} from '../validation/family.validation'
import validate from '../validation/Validator'

class FamilyRoutes {
	private familyController: FamilyController = new FamilyController()

	public routes(app: Application): void {
		app.route('/family')
			.post(
				createFamilyRules(),
				validate,
				this.familyController.createFamily
			)
			.get(this.familyController.getAllFamilies)

		app.route('/family/:familyId')
			.get(
				getFamilyByIdRules(),
				validate,
				this.familyController.getFamilyById
			)
			.patch(
				updateFamilyRules(),
				validate,
				this.familyController.updateFamily
			)
			.delete(
				deleteFamilyByIdRules(),
				validate,
				this.familyController.deleteFamily
			)
	}
}

export default FamilyRoutes
