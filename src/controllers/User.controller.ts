import { Request, Response } from 'express'

import { validationResult } from 'express-validator'
import { Types } from 'mongoose'
import {
	CreateUserInput,
	GetUserByIdInput
} from '../interfaces/User.interfaces'
import UserModel from '../models/User.model'

class UserController {
	public createUser = (req: CreateUserInput, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() })
		}

		const user = new UserModel(req.body)

		user.save()
			.then(() => {
				res.status(201).send(user)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public getUserById = async (req: GetUserByIdInput, res: Response) => {
		const userId = Types.ObjectId(req.params.userId)
		const user = await UserModel.findOne({ _id: userId })
		res.send(user)
	}

	public updateUser = (req: Request, res: Response) => {
		//
	}

	public deleteUser = (req: Request, res: Response) => {
		//
	}
}

export default UserController
