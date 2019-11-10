import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as mongoose from 'mongoose'
import validator from 'validator'

import { IUserModel } from '../interfaces/User.interfaces'

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

UserSchema.path('email').validate(email => {
	return validator.isEmail(email)
}, 'Email is invalid')

UserSchema.methods.generateAuthToken = async function() {
	const user: IUserModel = this
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

	return token
}

// Hash password before saving
UserSchema.pre('save', function(this: IUserModel, next) {
	const user: IUserModel = this
	const saltCycles = 8
	if (user.isModified('password')) {
		if (user.password.length < 8)
			throw Error('Password must be atleast 8 characters')
		user.password = bcrypt.hashSync(user.password, saltCycles)
	}

	next()
})

// Email uniqueness for proper error
UserSchema.post(
	'save',
	(error: any, doc: IUserModel, next: mongoose.HookNextFunction) => {
		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('Email must be unique'))
		} else {
			next(error)
		}
	}
)

export default mongoose.model<IUserModel>('User', UserSchema)
