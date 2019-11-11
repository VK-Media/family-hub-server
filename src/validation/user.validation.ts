import { check } from 'express-validator'
import { Mode } from '../interfaces/User.interfaces'

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
			.isHexColor()
	]
}

export const getUserByIdRules = () => {
	return [check('userId').isMongoId()]
}

export const updateUserRules = () => {
	return [
		check('userId').isMongoId(),
		check('email')
			.optional()
			.isEmail(),
		check('password')
			.optional()
			.isLength({ min: 8, max: 100 })
			.withMessage('Minimum length of 8 characters and max of 100'),
		check('profileColor')
			.optional()
			.isHexColor(),
		check('familyId')
			.optional()
			.isMongoId(),
		check('appMode')
			.optional()
			.isIn(Object.keys(Mode))
			.withMessage('Invalid value. Options include: ' + Object.keys(Mode))
	]
}

export const deleteUserRules = () => {
	return [check('userId').isMongoId()]
}