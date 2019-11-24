import { Response } from 'express'
import { Types } from 'mongoose'

import { IFamilyModel } from '../interfaces/Family.interfaces'
import {
	CreateUserInput,
	DeleteUserInput,
	GetAllUsersInput,
	GetUserByIdInput,
	GetUserEventsInput,
	GetUserFamilyInput,
	Mode,
	UpdateUserInput
} from '../interfaces/User.interfaces'
import { EventModel, FamilyModel, UserModel } from '../models/index'
import { addMemberToFamily, familyExist } from '../util/Models.util'

class UserController {
	public createUser = async (req: CreateUserInput, res: Response) => {
		let family: false | IFamilyModel
		if (req.body.family) {
			family = await familyExist(req.body.family)
			if (!family) {
				return res.status(400).send('Family does not exist')
			}
		}
		const user = new UserModel(req.body)

		user.save()
			.then(() => {
				if (family) addMemberToFamily(family, user._id)
				res.status(201).send({ user, jwt: user.generateJWT() })
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public getAllUsers = async (req: GetAllUsersInput, res: Response) => {
		const users = UserModel.find()

		if (req.query.includeFamily) users.populate('family')
		if (req.query.includeEvents) users.populate('events')

		users.exec().then(data => {
			res.send(data)
		})
	}

	public getUserById = async (req: GetUserByIdInput, res: Response) => {
		const user = UserModel.findById(req.params.userId)

		if (req.query.includeFamily) user.populate('family')
		if (req.query.includeEvents) user.populate('events')

		user.exec().then(data => {
			if (!data) return res.status(404).send()

			res.send(data)
		})
	}

	public updateUser = async (req: UpdateUserInput, res: Response) => {
		const user = await UserModel.findById(req.params.userId)

		if (!user) return res.status(404).send()

		try {
			if (req.body.newName) user.name = req.body.newName

			if (req.body.newEmail) user.email = req.body.newEmail

			if (req.body.newPassword) user.password = req.body.newPassword

			if (req.body.newProfileColor)
				user.profileColor = req.body.newProfileColor

			if (req.body.newFamilyId) {
				const family = await familyExist(req.body.newFamilyId)
				if (family) {
					user.family = Types.ObjectId(req.body.newFamilyId)
					addMemberToFamily(family, user._id)
				}
			}
			if (req.body.newAppMode) user.appMode = Mode[req.body.newAppMode]
		} catch (error) {
			console.error(error.message)
			res.status(500).send()
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
		const user = await UserModel.findById(req.params.userId)

		if (!user) return res.status(404).send()

		await user.remove()

		res.send(user._id)
	}

	public getUserFamily = async (req: GetUserFamilyInput, res: Response) => {
		const userFamily = await FamilyModel.findOne({
			members: req.params.userId
		})

		if (!userFamily) return res.status(404).send()

		res.send(userFamily)
	}

	public getUserEvents = async (req: GetUserEventsInput, res: Response) => {
		const userEvents = await EventModel.find({ _id: req.user.events })

		res.send(userEvents)
	}
}

export default UserController
