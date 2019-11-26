import { Response } from 'express'

import {
	CreateEventInput,
	DeleteEventInput,
	GetEventByIdInput,
	GetEventInput,
	IEventException,
	UpdateEventInput
} from '../interfaces/Event.interfaces'
import { EventModel } from '../models/index'
import socketServer from '../SocketServer'
import { addEventToParticipant, usersExist } from '../util/Models.util'
import { eventConstants } from '../util/SocketConstants.util'

class EventController {
	public createEvent = async (req: CreateEventInput, res: Response) => {
		const participants = await usersExist(req.body.participants)

		if (!participants) {
			return res
				.status(400)
				.send('Some or more participants does not exist')
		}

		const event = new EventModel(req.body)

		event
			.save()
			.then(() => {
				participants.forEach(partcipant => {
					addEventToParticipant(partcipant, event._id)
				})
				socketServer.server.emit(
					eventConstants.EVENT_CREATED + '[]',
					event
				)
				res.status(201).send({ event })
			})
			.catch((err: Error) => {
				console.error('Create Event Error: ', err.message)
				res.status(500).send({ error: err.message })
			})
	}

	public getEvents = async (req: GetEventInput, res: Response) => {
		const events = await EventModel.find()

		res.send({ events })
	}

	public getEventById = async (req: GetEventByIdInput, res: Response) => {
		const event = await EventModel.findById(req.params.eventId)

		if (!event) return res.status(404).send()

		res.send({ event })
	}

	public updateEvent = async (req: UpdateEventInput, res: Response) => {
		const event = await EventModel.findById(req.params.eventId)

		if (!event) return res.status(404).send()

		if (!(await usersExist(req.body.participants))) {
			return res
				.status(400)
				.send({ error: 'Participants does not exist' })
		}

		// TODO: Check to see if this works properly
		const exception = req.body.timeDetails.repeat.exception
		if (exception) {
			const newEventException: IEventException = {
				startTime: exception.startTime
					? exception.startTime
					: event.timeDetails.startTime,
				endTime: exception.endTime
					? exception.endTime
					: event.timeDetails.endTime,
				removed: exception.removed ? exception.removed : false
			}
			event.timeDetails.repeat.exceptions.push(newEventException)
		}
		await event
			.updateOne({ ...req.body })
			.then(() => {
				socketServer.server.emit(eventConstants.EVENT_UPDATED, event)
				res.send({ event })
			})
			.catch((err: Error) => {
				console.error('Update Event Error: ', err.message)
				res.status(500).send()
			})
	}

	public deleteEvent = async (req: DeleteEventInput, res: Response) => {
		const event = await EventModel.findById(req.params.eventId)

		if (!event) return res.status(404).send()

		await event.remove()

		socketServer.server.emit(eventConstants.EVENT_DELETED, event._id)

		res.send({ event: { id: event._id } })
	}
}

export default EventController
