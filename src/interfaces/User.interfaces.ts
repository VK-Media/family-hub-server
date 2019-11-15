import { Request } from 'express'
import { Document, Types } from 'mongoose'

// NOTE: Be careful changing this as database is using it
export enum Mode {
	AllAccess = 'AllAccess',
	ChildAccess = 'ChildAccess'
}

export interface IUserModel extends Document {
	_id: Types.ObjectId
	name: string
	email: string
	password: string
	appMode: Mode
	profilePicturePath: string
	profileColor: string
	family: Types.ObjectId
	events: Types.ObjectId[]
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
	params: {
		userId: string
	}
	query: {
		includeFamily: boolean
		includeEvents: boolean
	}
}

export interface UpdateUserInput extends Request {
	body: {
		newName?: string
		newEmail?: string
		newPassword?: string
		newProfileColor?: string
		newFamilyId?: string
		newAppMode?: Mode
	}
	params: {
		userId: string
	}
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

export interface DeleteUserInput extends Request {
	params: {
		userId: string
	}
}

export interface GetUserFamilyInput extends Request {
	params: {
		userId: string
	}
}

export interface GetUserEventsInput extends Request {
	params: {
		userId: string
	}
}
