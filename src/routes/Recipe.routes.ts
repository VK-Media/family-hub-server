import { Application } from 'express'
import { RecipeController } from '../controllers/index'

class RecipeRoutes {
	private userController: RecipeController = new RecipeController()

	public routes(app: Application): void {
		app.route('/recipe')
			.get(this.userController.getRecipes)
			.post(this.userController.createRecipe)

		app.route('/recipe/:recipeId')
			.get(this.userController.getRecipeById)
			.patch(this.userController.updateRecipe)
			.delete(this.userController.deleteRecipe)
	}
}

export default RecipeRoutes
