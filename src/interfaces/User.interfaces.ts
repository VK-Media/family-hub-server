import { Document, Types } from 'mongoose'

import { Request } from 'express'

// NOTE: Be careful changing this as database is using it
export enum Mode {
	AllAccess = 'AllAccess',
	ChildAccess = 'ChildAccess'
}

export interface UserModel extends Document {
	_id: Types.ObjectId
	name: string
	email: string
	password: string
	appMode: Mode
	profilePicturePath: string
	profileColor: string
	family: Types.ObjectId
	generateJWT: () => string
}

export interface CreateUserInput extends Request {
	body: {
		name: string
		email: string
		password: string
		profileColor?: string
		familyId?: string
		// TODO: Decide whether or not appMode should be settable here
	}
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

// tslint:disable-next-line: no-empty-interface // FIXME:
export interface GetAllUsersInput extends Request {
	// TODO:
}

export interface GetUserByIdInput extends Request {
	params: {
		userId: string
	}
}

export interface UpdateUserInput extends Request {
	body: {
		name?: string
		email?: string
		password?: string
		profileColor?: string
		familyId?: string
		appMode?: Mode
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
