import { check } from 'express-validator'
import { Mode } from '../interfaces/User.interfaces'
import { isObject } from '../util/Objects.util'

export const createUserRules = () => {
	return [
		check('email')
			.exists()
			.withMessage('Email is required')
			.bail()
			.isEmail(),
		check('name')
			.exists()
			.withMessage('Name is required')
			.bail()
			.isLength({ min: 3 })
			.withMessage('Minimum length of 3 characters'),
		check('password')
			.exists()
			.withMessage('Password is required')
			.bail()
			.isLength({ min: 8, max: 100 })
			.withMessage('Minimum length of 8 characters and max of 100'),
		check('profileColor')
			.optional()
			.isHexColor(),
		check('familyId')
			.optional()
			.isMongoId()
	]
}

export const getAllUsersRules = () => {
	return [
		check('includeFamily')
			.optional()
			.isBoolean()
			.withMessage('Must be true or false'),
		check('includeEvents')
			.optional()
			.isBoolean()
			.withMessage('Must be true or false')
	]
}

export const updateUserRules = () => {
	return [
		check('newName')
			.optional()
			.isLength({ min: 3 })
			.withMessage('Minimum length of 3 characters'),
		check('newCredentials')
			.optional()
			.custom(newCredentials => {
				return isObject(newCredentials)
			})
			.withMessage('Invalid object'),
		check('newCredentials.newEmail')
			.optional()
			.isEmail(),
		check('newCredentials.newPassword')
			.optional()
			.isLength({ min: 8, max: 100 })
			.withMessage('Minimum length of 8 characters and max of 100'),
		check('newProfileColor')
			.optional()
			.isHexColor(),
		check('newFamilyId')
			.optional()
			.isMongoId(),
		check('newAppMode')
			.optional()
			.isIn(Object.keys(Mode))
			.withMessage('Invalid value. Options include: ' + Object.keys(Mode))
	]
}
