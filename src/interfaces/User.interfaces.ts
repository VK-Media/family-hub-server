import { Document, Types } from 'mongoose'

import { IFamilyModel } from './Family.interfaces'

export enum Mode {
	AllAccess = 'ALL_ACCESS',
	Child = 'CHILD_MODE'
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
