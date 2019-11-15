import { isIn, isInt, isISO8601 } from 'validator'

import { PeriodOption, WeekDays } from '../interfaces/Event.interfaces'
import { isObject } from './Objects.util'

export const validateEventTimeDetails = (timeDetails: any) => {
	if (!isObject(timeDetails)) return Promise.reject('Not a valid object')

	const errors = {}

	if ('startTime' in timeDetails) {
		if (!isISO8601(timeDetails.startTime, { strict: true })) {
			errors['startTime'] =
				'Not a valid date / Not following ISO8601 standard'
		}
	} else {
		errors['startTime'] = 'Required'
	}

	if ('endTime' in timeDetails) {
		if (!isISO8601(timeDetails.startTime, { strict: true })) {
			errors['endTime'] =
				'Not a valid date / Not following ISO8601 standard'
		}
	}

	if ('repeat' in timeDetails) {
		if (isObject(timeDetails.repeat)) {
			if ('onWeekdays' in timeDetails.repeat) {
				if (
					!isIn(timeDetails.repeat.onWeekdays, Object.keys(WeekDays))
				) {
					errors['repeat'] = {
						...errors['repeat'],
						onWeekdays:
							'Invalid week day. Options include: ' +
							Object.keys(WeekDays)
					}
				}
			} else {
				errors['repeat'] = {
					...errors['repeat'],
					onWeekdays: 'Required'
				}
			}

			if ('frequency' in timeDetails.repeat) {
				if (
					!isIn(
						timeDetails.repeat.frequency,
						Object.keys(PeriodOption)
					)
				) {
					errors['repeat'] = {
						...errors['repeat'],
						onWeekdays:
							'Invalid Period Option. Options include: ' +
							Object.keys(PeriodOption)
					}
				}
			} else {
				errors['repeat'] = {
					...errors['repeat'],
					frequency: 'Required'
				}
			}

			if ('everyFrequency' in timeDetails.repeat) {
				if (!isInt(timeDetails.repeat.everyFrequency)) {
					errors['repeat'] = {
						...errors['repeat'],
						everyFrequency: 'Not a number'
					}
				}
			} else {
				errors['repeat'] = {
					...errors['repeat'],
					everyFrequency: 'Required'
				}
			}

			if ('endRepeat' in timeDetails.repeat) {
				if (
					!isISO8601(timeDetails.repeat.endRepeat, {
						strict: true
					})
				) {
					errors['repeat'] = {
						...errors['repeat'],
						endRepeat:
							'Not a valid date / Not following ISO8601 standard'
					}
				}
			}
		} else {
			errors['repeat'] = 'Not a valid object'
		}
	}

	if (Object.keys(errors).length !== 0) {
		return Promise.reject(errors)
	} else return true
}
