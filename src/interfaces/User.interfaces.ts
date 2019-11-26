import { Request } from 'express'
import { Document, Types } from 'mongoose'
import { CreateCredential } from './Credential.interfaces'

// NOTE: Be careful changing this as database is using it
export enum Mode {
	AllAccess = 'AllAccess',
	ChildAccess = 'ChildAccess'
}

export interface IUserModel extends Document {
	_id: Types.ObjectId
	name: string
	credentials: Types.ObjectId
	appMode: Mode
	profilePicturePath?: string
	profileColor: string
	family?: Types.ObjectId
	events?: Types.ObjectId[]
	generateJWT: () => string
}

export interface CreateUserInput extends Request {
	body: {
		name: string
		email: string
		password: string
		profileColor?: string
		family?: string
		// TODO: Decide whether or not appMode should be settable here
	}
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

export interface GetAllUsersInput extends Request {
	query: {
		includeFamily: boolean
		includeEvents: boolean
	}
}

export interface GetUserByIdInput extends Request {
	query: {
		includeFamily: boolean
		includeEvents: boolean
	}
	user: IUserModel
}

export interface UpdateUserInput extends Request {
	body: {
		newName?: string
		newCredentials?: {
			newEmail?: string
			newPassword?: string
		}
		newProfileColor?: string
		newFamilyId?: string
		newAppMode?: Mode
	}
	user: IUserModel
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

export interface DeleteUserInput extends Request {
	user: IUserModel
}

export interface GetUserFamilyInput extends Request {
	user: IUserModel
}

export interface GetUserEventsInput extends Request {
	user: IUserModel
}
