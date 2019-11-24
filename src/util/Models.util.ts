import { hashSync,  } from 'bcrypt'
import { Types } from 'mongoose'

import { IFamilyModel } from '../interfaces/Family.interfaces'
import { IUserModel } from '../interfaces/User.interfaces'
import { FamilyModel, UserModel } from '../models/index'

export const userExist = async (userId: string) => {
	const user = await UserModel.findById(userId)
	if (user) return user
	else return false
}

export const familyExist = async (familyId: string) => {
	const family = await FamilyModel.findById(familyId)
	if (family) return family
	else return false
}

export const usersExist = async (userIds: string[]) => {
	let allUsersExist: boolean = true
	const users: IUserModel[] = []

	for (const userId of userIds) {
		const user = await userExist(userId)

		if (!user) {
			allUsersExist = false
			return
		} else users.push(user)
	}

	if (allUsersExist) return users
	else return false
}

export const addEventToParticipant = (
	partcipant: IUserModel,
	eventId: Types.ObjectId
) => {
	if (!partcipant.events.includes(eventId)) {
		partcipant.events.push(eventId)
		partcipant.save().catch((err: Error) => {
			throw err
		})
	}
}

export const addMemberToFamily = (
	family: IFamilyModel,
	memberId: Types.ObjectId
) => {
	if (!family.members.includes(memberId)) {
		family.members.push(memberId)
		family.save().catch((err: Error) => {
			throw err
		})
	}
}

export const addFamilyToUser = (user: IUserModel, familyId: Types.ObjectId) => {
	user.family = familyId
	user.save().catch((err: Error) => {
		throw err
	})
}

export const hashPassword = (password: string) => {
	const bcryptCycles = 8
	const hashedPassword = hashSync(password, bcryptCycles)
	return hashedPassword
}
