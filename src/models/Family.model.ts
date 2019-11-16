import mongoose from 'mongoose'

import { IFamilyModel } from '../interfaces/Family.interfaces'
import { familyRef, userRef } from '../util/Schemas.util'
import UserModel from './User.model'

const FamilySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 20
		},
		members: [{ type: mongoose.Types.ObjectId, ref: userRef, unique: true }]
	},
	{
		timestamps: true
	}
)

FamilySchema.methods.toJSON = function() {
	const familyObject: IFamilyModel = this.toObject()
	delete familyObject.__v
	return familyObject
}

FamilySchema.path('members').validate((members: [mongoose.Types.ObjectId]) => {
	// TODO: Optimize
	const memberToAdd = members[members.length - 1] // The last index in the array is the member to be tested

	const member = members.slice(0, members.length - 1).find(m => {
		return m.equals(memberToAdd)
	})

	return !member
}, 'Member is already in family')

FamilySchema.pre('remove', async function(this: IFamilyModel, next) {
	const familyToRemove = this

	UserModel.find({
		_id: {
			$in: familyToRemove.members
		}
	}).then(members => {
		for (const member of members) {
			member.family = undefined
			member.save().catch((err: Error) => {
				throw err
			})
		}
	})

	next()
})

// Member uniqueness for proper error message when member already has a family
FamilySchema.post(
	'save',
	(error: any, doc: IFamilyModel, next: mongoose.HookNextFunction) => {
		// TODO: - Determine error type

		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('One of the members already has a family'))
		} else {
			next(error)
		}
	}
)

export default mongoose.model<IFamilyModel>(familyRef, FamilySchema, 'families')
