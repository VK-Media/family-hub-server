import { Document, Types } from 'mongoose'

export enum AccountType {
	NormalUser = 'NormalUser',
	Admin = 'Admin'
}

export interface ICredentialModel extends Document {
	_id: Types.ObjectId
	email: string
	password: string
	accountType: AccountType
}

export interface CreateCredential {
	email: string
	password: string
}
