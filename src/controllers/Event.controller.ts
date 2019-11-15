import { Response } from 'express'
import { Types } from 'mongoose'

import {
	CreateEventInput,
	DeleteEventInput,
	GetEventByIdInput,
	GetEventInput,
	UpdateEventInput
} from '../interfaces/Event.interfaces'
import { IUserModel } from '../interfaces/User.interfaces'
import { EventModel } from '../models/index'
import { addEventToParticipant, usersExist } from '../util/Models.util'

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
				res.status(201).send(event)
			})
			.catch((err: Error) => {
				console.error(err.message)
				res.status(500).send()
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

				res.send(event)
			})
			.catch((err: Error) => {
				console.error(err.message)
				res.status(500).send()
			})
	}

	public deleteEvent = async (req: DeleteEventInput, res: Response) => {
		const event = await EventModel.findByIdAndRemove(req.params.eventId)

		if (!event) return res.status(404).send()

		res.status(404).send()
	}
}

export default EventController
