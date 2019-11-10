import { Request, Response } from 'express'

import { Types } from 'mongoose'
import UserModel from '../models/User.model'

class UserController {
	public addNewUser = (req: Request, res: Response) => {
		console.log(req.body)

		const user = new UserModel(req.body)

		user.save()
			.then(() => {
				res.status(201).send(user)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public getUserById = (req: Request, res: Response) => {
		try {
			const userId = Types.ObjectId(req.params.userId)
			console.log(userId)
			const user = UserModel.findById((id: Types.ObjectId) =>
				id.equals(userId)
			)
			res.send(user)
		} catch (error) {
			res.status(400).send('Invalid userId')
		}
	}

	public updateUser = (req: Request, res: Response) => {
		//
	}

	public deleteUser = (req: Request, res: Response) => {
		//
	}
}

export default UserController
