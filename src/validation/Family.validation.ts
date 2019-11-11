import { check } from 'express-validator'

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
	]
}

export const getFamilyByIdRules = () => {
	return [check('familyId').isMongoId()]
}

export const updateFamilyRules = () => {
	return [
		check('newFamilyName')
			.optional()
			.isLength({ max: 40 })
	]
}

export const addNewFamilyMemberRules = () => {
	return [
		check('familyId').isMongoId(),
		check('newFamilyMemberId')
			.exists()
			.withMessage('Required')
			.bail()
			.isMongoId()
	]
}

export const deleteFamilyByIdRules = () => {
	return [check('familyId').isMongoId()]
}
