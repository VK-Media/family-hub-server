import { Types } from 'mongoose'
import { IUserModel } from '../interfaces/User.interfaces'
import { FamilyModel, UserModel } from '../models/index'
import { IFamilyModel } from 'src/interfaces/Family.interfaces'

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

	await new Promise((resolve, reject) => {
		userIds.forEach(async userId => {
			const user = await userExist(userId)
			if (!user) {
				allUsersExist = false
				resolve()
			} else users.push(user)
		})
		resolve()
	})

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
