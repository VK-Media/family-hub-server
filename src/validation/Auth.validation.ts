import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import { verify } from 'jsonwebtoken'
import { UserModel } from '../models'

export const loginRules = () => {
	return [
		check('email')
			.exists()
			.withMessage('Required')
			.bail()
			.isEmail()
			.withMessage('Invalid email'),
		check('password')
			.exists()
			.withMessage('Required')
			.bail()
			.isString()
			.withMessage('Must be a string')
	]
}

export const jwtAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization.split('Bearer ')[1] // Seperate Bearer and space from token

	try {
		const decodedToken: any = verify(token, process.env.JWT_SECRET)
		const user = await UserModel.findById(decodedToken._id)

		if (!user) throw new Error()

		req['user'] = user
		next()
	} catch (error) {
		return res.status(401).send('Invalid token')
	}
}
