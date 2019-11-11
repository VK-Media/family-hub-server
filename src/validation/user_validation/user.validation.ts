import { check } from 'express-validator'

export const createUserRules = () => {
	return [
		check('email')
			.exists()
			.withMessage('Email is required'),
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
			.withMessage('Invalid color format')
	]
}

export const getUserByIdRules = () => {
	return [
		check('userId')
			.isMongoId()
			.withMessage('Not a valid Id')
	]
}
