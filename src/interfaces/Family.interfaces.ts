import { Document, Types } from 'mongoose'

import { IUserModel } from './User.interfaces'

export interface IFamilyModel extends Document {
	_id: Types.ObjectId
	familyName: string
	members: IUserModel
}
