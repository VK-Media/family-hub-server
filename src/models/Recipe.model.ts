import * as mongoose from 'mongoose'
import { familyRefInDb } from './Family.model'

const RecipeSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: true
	},
	recipeDetails: {
		type: String,
		required: true
	},
	family: { type: mongoose.Types.ObjectId, ref: familyRefInDb }
})

export const recipeRefInDb = 'Recipe'

export default mongoose.model(recipeRefInDb, RecipeSchema)
