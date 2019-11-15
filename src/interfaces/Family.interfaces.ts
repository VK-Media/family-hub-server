import { Request } from 'express'
import { Document, Types } from 'mongoose'

export interface IFamilyModel extends Document {
	_id: Types.ObjectId
	name: string
	members: [Types.ObjectId]
}

export interface CreateFamilyInput extends Request {
	body: {
		familyName: string
		members: [string]
	}
}

// tslint:disable-next-line: no-empty-interface // FIXME:
export interface GetAllFamiliesInput extends Request {
	// TODO:
}

export interface GetFamilyByIdInput extends Request {
	params: {
		familyId: string
	}
}

export interface UpdateFamilyInput extends Request {
	body: {
		newFamilyName?: string
		newFamilyMemberId?: string
	}
	params: {
		familyId: string
	}
	// TODO: Profile picture form input, make to a url and then add to UserModel
}

export interface DeleteFamilyInput extends Request {
	params: {
		familyId: string
	}
}
