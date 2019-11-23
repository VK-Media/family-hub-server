import { Response } from 'express'
import { Types } from 'mongoose'

import {
	CreateEventInput,
	DeleteEventInput,
	GetEventByIdInput,
	GetEventInput,
	IEventException,
	UpdateEventInput
} from '../interfaces/Event.interfaces'
import { IUserModel } from '../interfaces/User.interfaces'
import { EventModel } from '../models/index'
import socketServer from '../SocketServer'
import { addEventToParticipant, usersExist } from '../util/Models.util'
import { eventConstants } from '../util/SocketConstants.util'

// TODO: JWT + authentication, Event fixing, https + raspberry pi + nginx + letsencrypt
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
				res.status(201).send(event)
			})
			.catch((err: Error) => {
				console.error('Create Event Error: ', err.message)
				res.status(500).send(err.message)
			})
	}

	public getEvents = async (req: GetEventInput, res: Response) => {
		const events = await EventModel.find()

		res.send(events)
	}

	public getEventById = async (req: GetEventByIdInput, res: Response) => {
		const event = await EventModel.findById(req.params.eventId)

		if (!event) return res.status(404).send()

		res.send(event)
	}

	public updateEvent = async (req: UpdateEventInput, res: Response) => {
		const event = await EventModel.findById(req.params.eventId)

		if (!event) return res.status(404).send()

		if (req.body.title) event.title = req.body.title

		if (req.body.description) event.description = req.body.description

		if (req.body.location) event.location = req.body.location

		if (req.body.timeDetails) {
			const timeDetails = req.body.timeDetails

			if (timeDetails.startTime)
				event.timeDetails.startTime = timeDetails.startTime

			if (timeDetails.endTime)
				event.timeDetails.endTime = timeDetails.endTime

			// Validation ensures that if allDay is set to true, req.body.timeDetails startTime and endTime is set correctly
			if (timeDetails.allDay) {
				event.timeDetails.allDay = true
				event.timeDetails.startTime = timeDetails.startTime
				event.timeDetails.endTime = timeDetails.endTime
			}

			if (timeDetails.repeat) {
				const repeat = req.body.timeDetails.repeat
				if (repeat.endRepeat)
					event.timeDetails.repeat.endRepeat = repeat.endRepeat

				if (repeat.frequency)
					event.timeDetails.repeat.frequency = repeat.frequency

				if (repeat.onWeekdays)
					event.timeDetails.repeat.onWeekdays = repeat.onWeekdays

				if (repeat.exceptions) {
					const exceptions = req.body.timeDetails.repeat.exceptions
					for (const exception of exceptions) {
						let startTime: Date
						exception.startTime
							? (startTime = exception.startTime)
							: (startTime = event.timeDetails.startTime)

						let endTime: Date
						exception.endTime
							? (endTime = exception.endTime)
							: (endTime = event.timeDetails.endTime)

						let removed: boolean
						exception.removed ? (removed = true) : (removed = false)

						const newEventException: IEventException = {
							startTime,
							endTime,
							removed
						}
						event.timeDetails.repeat.exceptions.push(
							newEventException
						)
					}
				}
			}
		}

		if (req.body.alert) event.alert = req.body.alert

		let participants: false | IUserModel[]
		if (req.body.participants) {
			participants = await usersExist(req.body.participants)
			if (participants) {
				const participantIds: Types.ObjectId[] = req.body.participants.map(
					(participantId: string) => Types.ObjectId(participantId)
				)

				event.participants = participantIds
			}
		}

		event
			.save()
			.then(() => {
				if (participants) {
					participants.forEach(partcipant => {
						addEventToParticipant(partcipant, event._id)
					})
				}
				socketServer.server.emit(eventConstants.EVENT_UPDATED, event)
				res.send(event)
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

		res.send(event._id)
	}
}

export default EventController
