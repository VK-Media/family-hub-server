import { Application } from 'express'
import { EventController } from '../controllers/index'

class UserRoutes {
	private userController: EventController = new EventController()

	public routes(app: Application): void {
		app.route('/event')
			.get(this.userController.getEvents)
			.post(this.userController.createEvent)

		app.route('/event/:eventId')
			.get(this.userController.getEventById)
			.patch(this.userController.updateEvent)
			.delete(this.userController.deleteEvent)
	}
}

export default UserRoutes
