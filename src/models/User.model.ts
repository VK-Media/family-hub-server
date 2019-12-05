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

UserSchema.path('profileColor').validate((color: string) => {
	return isHexColor(color)
})

UserSchema.path('email').validate((email: string) => {
	return isEmail(email)
}, 'Email is invalid')

UserSchema.methods.toJSON = function() {
	const userObject: IUserModel = this.toObject()
	delete userObject.__v
	delete userObject.password
	const id = userObject._id
	delete userObject._id
	userObject['id'] = id
	return userObject
}

UserSchema.methods.generateJWT = function() {
	const user: IUserModel = this
	const jwt = sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
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

UserSchema.pre('remove', async function(this: IUserModel, next) {
	const userToRemove = this

	const family = await FamilyModel.findById(userToRemove.family)

	if (family) {
		const familyMembersWithoutUser: Types.ObjectId[] = family.members.filter(
			memerId => !memerId.equals(userToRemove._id)
		)

		family.members = familyMembersWithoutUser
		try {
			await family.save()
		} catch (error) {
			console.error('User Pre Remove - Family Save', error.message)
			throw error
		}
	}

	const events = await EventModel.find({
		participants: userToRemove._id
	})

	if (events) {
		for (const event of events) {
			// Event was only related to user to be removed, therefore should be removed completly
			if (event.participants.length === 1) {
				await event.remove()
			} else {
				event.participants = event.participants.filter(
					participantId => !participantId.equals(userToRemove._id)
				)
				try {
					await event.save()
				} catch (error) {
					console.error(
						'User pre remove - Event update participants',
						error.message
					)
					throw error
				}
			}
		}
	}

	next()
})

export default mongoose.model<IUserModel>(userRef, UserSchema)
