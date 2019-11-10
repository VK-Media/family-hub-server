import { Document, Types } from 'mongoose'
import { IFamilyModel } from './Family.interfaces'

export interface IRecipeModel extends Document {
	_id: Types.ObjectId
	title: string
	recipeDetails: string // TODO: Figure out how to save recipes in the database (loose structure or tight structure?)
	family: IFamilyModel
}
