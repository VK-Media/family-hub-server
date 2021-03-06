import { Application } from 'express'

import { EventController } from '../controllers/Index'
import socketServer from '../SocketServer'
import { demoConstants } from '../util/SocketConstants.util'
import {
	createEventRules,
	deleteEventByIdRules,
	getEventByIdRules,
	getEventsRules,
	updateEventRules
} from '../validation/Event.validation'
import validate from '../validation/Validator'

class EventRoutes {
	private eventController: EventController = new EventController()

	public routes(app: Application): void {
		app.route('/event')
			.get(
				getEventsRules(),
				validate,
				this.eventController.getEvents
			)
			.post(
				createEventRules(),
				validate,
				this.eventController.createEvent
			)

		app.route('/event/:eventId')
			.get(
				getEventByIdRules(),
				validate,
				this.eventController.getEventById
			)
			.patch(
				updateEventRules(),
				validate,
				this.eventController.updateEvent
			)
			.delete(
				deleteEventByIdRules(),
				validate,
				this.eventController.deleteEvent
			)
	}

	public realtimeRoutes(): void {
		socketServer.server.on('connection', socket => {
			console.log('Client connected')

			socket.emit(demoConstants.NEWS, 'BREAKING NEWS')

			socket.on(demoConstants.OTHER_EVENT, data => {
				console.log(data)
			})
		})
	}
}

export default EventRoutes
