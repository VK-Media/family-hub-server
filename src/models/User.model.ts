import { sign } from 'jsonwebtoken'
import mongoose, { Types } from 'mongoose'
import { isEmail, isHexColor } from 'validator'

import { IUserModel, Mode } from '../interfaces/User.interfaces'
import { hashPassword } from '../util/Models.util'
import { eventRef, familyRef, userRef } from '../util/Schemas.util'
import EventModel from './Event.model'
import FamilyModel from './Family.model'

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		},
		appMode: {
			type: String,
			enum: Object.keys(Mode),
			default: Mode.AllAccess,
			required: true
		},
		profilePicturePath: {
			type: String,
			trim: true,
			lowercase: true
		},
		profileColor: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
			default: '#808080'
		},
		family: { type: mongoose.Types.ObjectId, ref: familyRef },
		events: [
			{
				type: mongoose.Types.ObjectId,
				ref: eventRef
			}
		]
	},
	{
		timestamps: true
	}
)

UserSchema.path('email').validate((email: string) => {
	return isEmail(email)
}, 'Email is invalid')

UserSchema.path('profileColor').validate((color: string) => {
	return isHexColor(color)
})

UserSchema.methods.toJSON = function() {
	const userObject: IUserModel = this.toObject()
	delete userObject.password
	delete userObject.__v
	return userObject
}

UserSchema.methods.generateJWT = function() {
	const person: IUserModel = this
	const jwt = sign({ _id: person._id.toString() }, process.env.JWT_SECRET, {
		expiresIn: '30 days',
		notBefore: 2 // First valid after 2 seconds to avoid brute force attacks
	})

	return jwt
}

// Hash password before saving
UserSchema.pre('save', function(this: IUserModel, next) {
	const user = this
	if (user.isModified('password')) {
		if (user.password.length < 8) {
			throw Error('Password must be atleast 8 characters')
		}
		user.password = hashPassword(user.password)
	}
	next()
})

UserSchema.pre('remove', async function(this: IUserModel, next) {
	const userToRemove = this

	const family = await FamilyModel.findById(userToRemove.family)

	if (family) {
		const familyMembersWithoutUser: Types.ObjectId[] = family.members.filter(
			memerId => !memerId.equals(userToRemove._id)
		)

		family.members = familyMembersWithoutUser

		family.save().catch((err: Error) => {
			throw err
		})
	}

	const events = await EventModel.find({
		participants: userToRemove._id
	})

	if (events) {
		events.forEach(async event => {
			// Event was only related to user to be removed, therefore should be removed completly
			if (event.participants.length === 1) {
				event.remove()
			} else {
				event.participants = event.participants.filter(
					participantId => !participantId.equals(userToRemove._id)
				)
			}
			event.save().catch((err: Error) => {
				throw err
			})
		})
	}

	next()
})

// Email uniqueness for proper error message
UserSchema.post(
	'save',
	(error: any, doc: IUserModel, next: mongoose.HookNextFunction) => {
		// TODO: - Determine error type

		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('Email must be unique'))
		} else {
			next(error)
		}
	}
)

export default mongoose.model<IUserModel>(userRef, UserSchema)
