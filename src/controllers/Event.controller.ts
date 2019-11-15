import { Response } from 'express'
import { Types } from 'mongoose'

import {
	CreateEventInput,
	DeleteEventInput,
	GetEventByIdInput,
	GetEventInput,
	UpdateEventInput
} from '../interfaces/Event.interfaces'
import { EventModel } from '../models/index'
import { usersExist } from '../util/Models.util'

class EventController {
	public createEvent = async (req: CreateEventInput, res: Response) => {
		const participantsExist = await usersExist(req.body.participants)

		if (!participantsExist) {
			return res
				.status(400)
				.send('Some or more participants does not exist')
		}

		const event = new EventModel(req.body)

		event
			.save()
			.then(() => {
				res.status(201).send(event)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
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
		if (req.body.timeDetails) event.timeDetails = req.body.timeDetails // TODO: Decide whether or not it should override eventDetails or not
		if (req.body.alert) event.alert = req.body.alert
		if (req.body.participants) {
			const participantsExist = await usersExist(req.body.participants)
			if (participantsExist) {
				const participantIds: Types.ObjectId[] = req.body.participants.map(
					(participantId: string) => Types.ObjectId(participantId)
				)

				event.participants = participantIds
			}
		}

		event
			.save()
			.then(() => {
				res.send(event)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public deleteEvent = async (req: DeleteEventInput, res: Response) => {
		const event = await EventModel.findByIdAndDelete(req.params.eventId)

		if (!event) return res.status(404).send()

		res.status(404).send()
	}
}

export default EventController
