import { hashSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import * as mongoose from 'mongoose'
import { isEmail, isHexColor } from 'validator'

import { IUserModel, Mode } from '../interfaces/User.interfaces'
import { eventRefInDb } from './Event.model'
import { familyRefInDb } from './Family.model'

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
			lowercase: true,
			unique: true
		},
		profileColor: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
			default: '#808080'
		},
		family: { type: mongoose.Types.ObjectId, ref: familyRefInDb },
		events: [
			{
				type: mongoose.Types.ObjectId,
				ref: eventRefInDb
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
	return userObject
}

UserSchema.methods.generateJWT = async function() {
	const person: IUserModel = this
	const token = sign({ _id: person._id.toString() }, process.env.JWT_SECRET)

	return token
}

// Hash password before saving
UserSchema.pre('save', function(this: IUserModel, next) {
	const user: IUserModel = this
	const saltCycles = 8
	if (user.isModified('password')) {
		if (user.password.length < 8)
			throw Error('Password must be atleast 8 characters')
		user.password = hashSync(user.password, saltCycles)
	}

	next()
})

// Email uniqueness for proper error message
UserSchema.post(
	'save',
	(error: any, doc: IUserModel, next: mongoose.HookNextFunction) => {
		// TODO: - Determine error type
		console.log(typeof error)

		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('Email must be unique'))
		} else {
			next(error)
		}
	}
)

export const userRefInDb: string = 'User'

export default mongoose.model<IUserModel>(userRefInDb, UserSchema)
