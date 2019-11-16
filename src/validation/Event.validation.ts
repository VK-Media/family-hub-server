import { check } from 'express-validator'
import { isMongoId } from 'validator'

import {
	eventDescriptionMaxLength,
	eventTitleMaxLength
} from '../util/Schemas.util'
import { validateEventTimeDetails } from '../util/Validation.util'

export const createEventRules = () => {
	return [
		check('title')
			.exists()
			.withMessage('Required')
			.bail()
			.isLength({ max: eventTitleMaxLength })
			.withMessage('Max length of ' + eventTitleMaxLength),
		check('description')
			.exists()
			.withMessage('Required')
			.bail()
			.isLength({ max: eventDescriptionMaxLength })
			.withMessage('Max length of ' + eventDescriptionMaxLength),
		check('location')
			.optional()
			.isString(),
		check('timeDetails')
			.exists()
			.withMessage('Required')
			.bail()
			.custom(timeDetails => {
				return validateEventTimeDetails(timeDetails)
			}),
		check('alert')
			.optional()
			.isISO8601({ strict: true })
			.withMessage('Not a valid date / Not following ISO8601 standard'),
		check('participants')
			.exists()
			.withMessage('Required')
			.bail()
			.isArray({ min: 1 })
			.withMessage(
				"An event can't exist without atleast one participant. Provide array of participants"
			)
			.custom((participants: string[]) => {
				for (const participant of participants) {
					if (!isMongoId(participant)) {
						return Promise.reject('Participant ID(s) invalid')
					}
				}
				return true
			})
			.custom((partcipants: string[]) => {
				// Check for duplicates participant IDs
				for (let i: number = 0; i < partcipants.length; i++) {
					if (partcipants.indexOf(partcipants[i], i + 1) !== -1) {
						return Promise.reject(
							'Duplicate participants not allowed'
						)
					}
				}
				return true
			})
	]
}

// TODO:
export const getEventsRules = () => {
	return []
}

export const getEventByIdRules = () => {
	return [check('eventId').isMongoId()]
}

export const updateEventRules = () => {
	return [
		check('eventId').isMongoId(),
		check('title')
			.optional()
			.isLength({ max: eventTitleMaxLength })
			.withMessage('Max length of ' + eventTitleMaxLength),
		check('descripton')
			.optional()
			.isLength({ max: eventDescriptionMaxLength })
			.withMessage('Max length of ' + eventDescriptionMaxLength),
		check('location')
			.optional()
			.isString(),
		check('timeDetails')
			.optional()
			.custom(timeDetails => {
				return validateEventTimeDetails(timeDetails)
			}),
		check('alert')
			.optional()
			.isISO8601({ strict: true })
			.withMessage('Not a valid date / Not following ISO8601 standard'),
		check('participants')
			.optional()
			.isArray({ min: 1 })
			.withMessage(
				"An event can't exist without atleast one participant. Provide array of participants"
			)
			.custom(async (participants: [string]) => {
				let allParticipantValidMongoId = true
				participants.forEach(participant => {
					if (!isMongoId(participant)) {
						allParticipantValidMongoId = false
						return
					}
				})

				if (allParticipantValidMongoId) return true
				else return Promise.reject('Participant ID(s) invalid')
			})
	]
}

export const deleteEventByIdRules = () => {
	return [check('eventId').isMongoId()]
}
