import { check } from 'express-validator'
import { isMongoId } from 'validator'

export const createFamilyRules = () => {
	return [
		check('name')
			.exists()
			.withMessage('Required')
			.isLength({ max: 40 }),
		check('members')
			.exists()
			.withMessage('Required')
			.bail()
			.isArray({ min: 1 })
			.withMessage("A family can't exist without atleast one user")
			.custom((members: []) => {
				members.forEach(member => {
					if (!isMongoId(member)) {
						return Promise.reject('Not a valid member ID')
					}
				})
				return true
			})
	]
}

export const getFamilyByIdRules = () => {
	return [check('familyId').isMongoId()]
}

export const updateFamilyRules = () => {
	return [
		check('familyId').isMongoId(),
		check('newFamilyMemberId')
			.optional()
			.isMongoId(),
		check('newFamilyName')
			.optional()
			.isLength({ max: 40 })
	]
}

export const deleteFamilyByIdRules = () => {
	return [check('familyId').isMongoId()]
}
