import { Document, Types } from 'mongoose'

import { Request } from 'express'
import { FamilyModel } from './Family.interfaces'

export enum Mode {
	AllAccess,
	Child
}

export interface UserModel extends Document {
	_id: Types.ObjectId
	name: string
	email: string
	password: string
	appMode: Mode
	profilePicturePath: string
	profileColor: string
	family: FamilyModel
	generateJWT: () => string
}

export interface CreateUserInput extends Request {
	body: {
		name: string
		email: string
		password: string
		profileColor?: string
		familyId?: Types.ObjectId
		// TODO: Decide whether or not appMode should be settable here
	}
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

export interface GetUserByIdInput extends Request {
	params: {
		userId: string
	}
}
