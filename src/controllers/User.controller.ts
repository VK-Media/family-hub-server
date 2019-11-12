import { Response } from 'express'
import { Types } from 'mongoose'

import {
	CreateUserInput,
	DeleteUserInput,
	GetAllUsersInput,
	GetUserByIdInput,
	GetUserFamilyInput,
	Mode,
	UpdateUserInput
} from '../interfaces/User.interfaces'
import FamilyModel from '../models/Family.model'
import UserModel from '../models/User.model'
import { familyExist } from '../util/Models.util'

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
			if (req.body.newName) user.name = req.body.newName

			if (req.body.newEmail) user.email = req.body.newEmail

			if (req.body.newPassword) user.password = req.body.newPassword

			if (req.body.newProfileColor)
				user.profileColor = req.body.newProfileColor

			if (req.body.newFamilyId) {
				if (familyExist(req.body.newFamilyId)) {
					user.family = Types.ObjectId(req.body.newFamilyId)
				}
			}
			if (req.body.newAppMode) user.appMode = Mode[req.body.newAppMode]
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

	public getUserFamily = async (req: GetUserFamilyInput, res: Response) => {
		const userFamily = await FamilyModel.findOne({
			members: req.params.userId
		})

		res.send(userFamily)
	}
}

export default UserController
