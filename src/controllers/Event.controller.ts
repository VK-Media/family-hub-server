import { Request, Response } from 'express'

import { CreateEventInput } from '../interfaces/Event.interfaces'
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

	public getEvents = (req: Request, res: Response) => {
		//
	}

	public getEventById = (req: Request, res: Response) => {
		//
	}

	public updateEvent = (req: Request, res: Response) => {
		//
	}

	public deleteEvent = (req: Request, res: Response) => {
		//
	}
}

export default EventController
