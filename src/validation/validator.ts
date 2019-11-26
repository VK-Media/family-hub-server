import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export interface ObjectToValidate {
	test: (value: any, userInput: any) => boolean
	errorMessage: string
	required?: boolean
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
		if (!validationObject[key].hasOwnProperty('test')) {
			checkValidationSchema(
				validationObject[key],
				userInput && userInput[key],
				errorsOutput
			)
			continue
		}
		if (validationObject[key] && userInput && userInput[key]) {
			const result = validationObject[key].test(userInput[key], userInput)
			if (!result) {
				errorsOutput[key] = validationObject[key].errorMessage
			}
		} else {
			if (validationObject[key].required) {
				errorsOutput[key] = 'Required'
				break
			}
		}
	}
}

export default validate
