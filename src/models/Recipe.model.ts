import mongoose from 'mongoose'

import { familyRef, recipeRef } from '../util/ModelRef.util'

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
	family: { type: mongoose.Types.ObjectId, ref: familyRef }
})

export default mongoose.model(recipeRef, RecipeSchema)
