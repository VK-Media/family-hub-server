import * as mongoose from 'mongoose'

import { FamilyModel } from '../interfaces/Family.interfaces'
import { userRefInDb } from './User.model'

const FamilySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 20
		},
		members: [
			{ type: mongoose.Types.ObjectId, ref: userRefInDb, unique: true }
		]
	},
	{
		timestamps: true
	}
)

FamilySchema.path('members').validate((members: [mongoose.Types.ObjectId]) => {
	// TODO: Optimize
	const memberToAdd = members[members.length - 1] // The last index in the array is the member to be tested

	const member = members.slice(0, members.length - 1).find(m => {
		return m.equals(memberToAdd)
	})

	return !member
}, 'Member is already in family')

// Member uniqueness for proper error message when member already has a family
FamilySchema.post(
	'save',
	(error: any, doc: FamilyModel, next: mongoose.HookNextFunction) => {
		// TODO: - Determine error type

		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('One of the members already has a family'))
		} else {
			next(error)
		}
	}
)

export const familyRefInDb: string = 'Family'

export default mongoose.model<FamilyModel>(
	familyRefInDb,
	FamilySchema,
	'families'
)
