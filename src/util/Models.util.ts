import { FamilyModel, UserModel } from '../models/index'

export const userExist = async (userId: string) => {
	return (await UserModel.findById(userId)) ? true : false
}

export const familyExist = async (familyId: string) => {
	return (await FamilyModel.findById(familyId)) ? true : false
}

export const usersExist = async (userIds: [string]) => {
	let allUsersExist: boolean = true

	await new Promise((resolve, reject) => {
		userIds.forEach(async userId => {
			if (!(await userExist(userId))) {
				allUsersExist = false
				resolve()
			}
		})
		resolve()
	})

	return allUsersExist
}
