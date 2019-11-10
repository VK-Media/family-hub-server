import { Document, Types } from 'mongoose'

export interface IUserModel extends Document {
    _id: Types.ObjectId
    email: string
    password: string
}