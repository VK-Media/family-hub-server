import * as mongoose from 'mongoose'

import { IFamilyModel } from '../interfaces/Family.interfaces'
import { userRefInDb } from './User.model'

const FamilySchema = new mongoose.Schema(
	{
		familyName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 20
		},
		members: [{ type: mongoose.Types.ObjectId, ref: userRefInDb }]
	},
	{
		timestamps: true
	}
)

export const familyRefInDb: string = 'Family'

export default mongoose.model<IFamilyModel>(
	familyRefInDb,
	FamilySchema,
	'Families'
)
