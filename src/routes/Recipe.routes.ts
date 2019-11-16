import { Application } from 'express'
import { RecipeController } from '../controllers/Index'

class RecipeRoutes {
	private recipeController: RecipeController = new RecipeController()

	public routes(app: Application): void {
		app.route('/recipe')
			.get(this.recipeController.getRecipes)
			.post(this.recipeController.createRecipe)

		app.route('/recipe/:recipeId')
			.get(this.recipeController.getRecipeById)
			.patch(this.recipeController.updateRecipe)
			.delete(this.recipeController.deleteRecipe)
	}
}

export default RecipeRoutes
