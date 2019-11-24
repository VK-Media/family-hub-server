import { compare } from 'bcrypt'
import { Response } from 'express'
import { LoginInput } from '../interfaces/Auth.interfaces'

import { UserModel } from '../models/index'

class EventController {
	public login = async (req: LoginInput, res: Response) => {
		const user = await UserModel.findOne({
			email: req.body.email
		})

		const correctPassword = await compare(req.body.password, user.password)

		if (correctPassword) {
			res.send({ jwt: user.generateJWT() })
		} else res.status(400).send('Invalid credentials')
	}
}

export default EventController
