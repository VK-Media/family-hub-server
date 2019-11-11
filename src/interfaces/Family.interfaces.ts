import { Document, Types } from 'mongoose'

import { UserModel } from './User.interfaces'

export interface FamilyModel extends Document {
	_id: Types.ObjectId
	familyName: string
	members: UserModel
}
