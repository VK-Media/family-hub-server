import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export interface ObjectToValidate {
	test: (value: any, userInput: any) => string
	required?: (userInput: any) => boolean
}

export interface ValidateSchema {
	[key: string]: ValidateSchema | ObjectToValidate
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		return next()
	}

	const extractedErrors = []
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({ errors: extractedErrors })
}

export const checkValidationSchema = (
	validationObject: ValidateSchema | ObjectToValidate,
	userInput: any,
	errorsOutput: {}
) => {
	for (const key of Object.keys(validationObject)) {
		// Recursive call
		if (!validationObject[key].hasOwnProperty('test')) {
			checkValidationSchema(
				validationObject[key],
				userInput,
				errorsOutput
			)
			continue
		}

		// Check to see if input has been defined and if it satisfies the test
		if (validationObject[key] && userInput && userInput[key]) {
			const result = validationObject[key].test(userInput[key], userInput)
			if (result !== '') {
				errorsOutput[key] = validationObject[key].errorMessage
			}
		} else {
			// If input is not defined, check if it was a required field and that the parent is a required field
			if (
				validationObject[key].required &&
				validationObject[key].required(userInput[key])
			) {
				errorsOutput[key] = 'Required'
				break
			}
		}
	}
}

export default validate
