import mongoose from 'mongoose'
import { isEmail } from 'validator'

import {
	AccountType,
	ICredentialModel
} from '../interfaces/Credential.interfaces'
import { hashPassword } from '../util/Models.util'
import { credentialRef } from '../util/Schemas.util'

const CredentialSchema = new mongoose.Schema(
	{
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
		accountType: {
			type: String,
			enum: Object.keys(AccountType),
			default: AccountType.NormalUser,
			required: true
		}
	},
	{
		timestamps: true
	}
)

CredentialSchema.path('email').validate((email: string) => {
	return isEmail(email)
}, 'Email is invalid')

CredentialSchema.methods.toJSON = function() {
	const credentialObject: ICredentialModel = this.toObject()
	delete credentialObject.password
	delete credentialObject.__v
	const id = credentialObject._id
	delete credentialObject._id
	credentialObject['id'] = id
	return credentialObject
}

// Hash password before saving
CredentialSchema.pre('save', function(this: ICredentialModel, next) {
	const credential = this
	if (credential.isModified('password')) {
		if (credential.password.length < 8) {
			throw Error('Password must be atleast 8 characters')
		}
		credential.password = hashPassword(credential.password)
	}
	next()
})

// Email uniqueness for proper error message
CredentialSchema.post(
	'save',
	(error: any, doc: ICredentialModel, next: mongoose.HookNextFunction) => {
		// TODO: - Determine error type

		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('Email must be unique'))
		} else {
			next(error)
		}
	}
)

export default mongoose.model<ICredentialModel>(credentialRef, CredentialSchema)
