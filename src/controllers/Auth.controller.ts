import { compare } from 'bcrypt'
import { Response } from 'express'

import { LoginInput } from '../interfaces/Auth.interfaces'
import CredentialModel from '../models/Credential.model'
import { UserModel } from '../models/index'

class EventController {
	public login = async (req: LoginInput, res: Response) => {
		const userCredential = await CredentialModel.findOne({
			email: req.body.email
		})

		if (!userCredential) {
			return res.status(400).send({ error: 'Invalid credentials' })
		}

		const correctPassword = await compare(
			req.body.password,
			userCredential.password
		)

		const user = await UserModel.findOne({
			credentials: userCredential._id
		})

		if (correctPassword) {
			res.send({ jwt: user.generateJWT() })
		} else res.status(400).send({ error: 'Invalid credentials' })
	}
}

export default EventController
