import { Application } from 'express'

import { EventController } from '../controllers/Index'
import {
	createEventRules,
	deleteEventByIdRules,
	getEventByIdRules,
	getEventsRules,
	updateEventRules
} from '../validation/Event.validation'
import validate from '../validation/Validator'

class UserRoutes {
	private userController: EventController = new EventController()

	public routes(app: Application): void {
		app.route('/event')
			.get(getEventsRules(), validate, this.userController.getEvents)
			.post(createEventRules(), validate, this.userController.createEvent)

		app.route('/event/:eventId')
			.get(
				getEventByIdRules(),
				validate,
				this.userController.getEventById
			)
			.patch(
				updateEventRules(),
				validate,
				this.userController.updateEvent
			)
			.delete(
				deleteEventByIdRules(),
				validate,
				this.userController.deleteEvent
			)
	}
}

export default UserRoutes
