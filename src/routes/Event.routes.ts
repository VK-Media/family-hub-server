import { Application } from 'express'

import { EventController } from '../controllers/Index'
import { createEventRules } from '../validation/Event.validation'
import validate from '../validation/Validator'

class UserRoutes {
	private userController: EventController = new EventController()

	public routes(app: Application): void {
		app.route('/event')
			.get(this.userController.getEvents)
			.post(createEventRules(), validate, this.userController.createEvent)

		app.route('/event/:eventId')
			.get(this.userController.getEventById)
			.patch(this.userController.updateEvent)
			.delete(this.userController.deleteEvent)
	}
}

export default UserRoutes
