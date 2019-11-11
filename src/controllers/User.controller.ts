import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Types } from 'mongoose'

import {
	CreateUserInput,
	DeleteUserInput,
	GetAllUsersInput,
	GetUserByIdInput,
	Mode,
	UpdateUserInput
} from '../interfaces/User.interfaces'
import UserModel from '../models/User.model'

class UserController {
	public createUser = (req: CreateUserInput, res: Response) => {
		const user = new UserModel(req.body)

		user.save()
			.then(() => {
				res.status(201).send(user)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public getAllUsers = async (req: GetAllUsersInput, res: Response) => {
		const users = await UserModel.find()

		res.send(users)
	}

	public getUserById = async (req: GetUserByIdInput, res: Response) => {
		const user = await UserModel.findById(req.params.userId)
		res.send(user)
	}

	public updateUser = async (req: UpdateUserInput, res: Response) => {
		const user = await UserModel.findById(req.params.userId)
		try {
			if (req.body.name) user.name = req.body.name
			if (req.body.email) user.email = req.body.email
			if (req.body.password) user.password = req.body.password
			if (req.body.profileColor) user.profileColor = req.body.profileColor
			if (req.body.familyId)
				user.family = Types.ObjectId(req.body.familyId)
			if (req.body.appMode) user.appMode = Mode[req.body.appMode]
		} catch (error) {
			res.status(400).send(error.message)
		}

		user.save()
			.then(() => {
				res.send(user)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public deleteUser = async (req: DeleteUserInput, res: Response) => {
		const user = await UserModel.findOneAndDelete(req.params.userId)
		res.send(user)
	}
}

export default UserController
