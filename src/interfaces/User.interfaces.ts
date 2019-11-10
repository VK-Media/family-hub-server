import { Document, Types } from 'mongoose'

import { IFamilyModel } from './Family.interfaces'

export enum Mode {
	AllAccess,
	Child
}

export interface IUserModel extends Document {
	_id: Types.ObjectId
	name: string
	email: string
	password: string
	appMode: Mode
	profilePicturePath: string
	profileColor: string
	generateJWT: () => string
	family: IFamilyModel
}
