import { isBoolean, isIn, isISO8601 } from 'validator'

import { PeriodOption, WeekDays } from '../interfaces/Event.interfaces'
import { ValidateSchema } from './Validator'

const invalidISO8601Message = 'Not following ISO8601 standard'

export const timeDetailsCreate: ValidateSchema = {
	startTime: {
		test: (startTime, userInput) => {
			// allDay parameter is not set startTime should be set
			if (!userInput.allDay) return false
			else return isISO8601(startTime, { strict: true })
		},
		errorMessage: invalidISO8601Message
	},
	endTime: {
		required: true,
		test: (endTime, userInput) => {
			// allDay parameter is not set startTime should be set
			if (!userInput.allDay) return false
			else return isISO8601(endTime, { strict: true })
		},
		errorMessage: invalidISO8601Message
	},
	allDay: {
		test: (allDay, userInput) => {
			if (isISO8601(allDay, { strict: true })) {
				const allDayDate = new Date(allDay)
				const startTimeDate = new Date(allDayDate.setHours(0, 0, 0, 0))
				const endTimeDate = new Date(
					allDayDate.setHours(23, 59, 59, 999)
				)
				userInput.startTime = startTimeDate
				userInput.endTime = endTimeDate
				userInput.allDay = true
				return true
			} else return false
		},
		errorMessage: invalidISO8601Message
	},
	repeat: {
		// TODO: Only check the nested objects if repeat is required, which it isn't
		frequency: {
			required: true,
			test: frequency => isIn(frequency, Object.keys(PeriodOption)),
			errorMessage:
				'Invalid frequency. Options include ' +
				Object.keys(PeriodOption)
		},
		onWeekdays: {
			test: onWeekdays => {
				for (const weekday of onWeekdays) {
					if (!isIn(weekday, Object.keys(WeekDays))) {
						return false
					}
				}
				return true
			},
			errorMessage:
				'Invalid Weekday. Options include ' + Object.keys(WeekDays)
		},
		endRepeat: {
			test: endRepeat => isISO8601(endRepeat, { strict: true }),
			errorMessage: invalidISO8601Message
		}
	}
}

export const timeDetailsUpdate: ValidateSchema = {
	startTime: {
		test: startTime => isISO8601(startTime, { strict: true }),
		errorMessage: invalidISO8601Message
	},
	endTime: {
		test: endTime => isISO8601(endTime, { strict: true }),
		errorMessage: invalidISO8601Message
	},
	allDay: {
		test: (allDay, userInput) => {
			if (isISO8601(allDay, { strict: true })) {
				const allDayDate = new Date(allDay)
				const startTimeDate = new Date(allDayDate.setHours(0, 0, 0, 0))
				const endTimeDate = new Date(
					allDayDate.setHours(23, 59, 59, 999)
				)
				userInput.startTime = startTimeDate
				userInput.endTime = endTimeDate
				userInput.allDay = true
				return true
			} else return false
		},
		errorMessage: invalidISO8601Message
	},
	repeat: {
		frequency: {
			test: frequency => isIn(frequency, Object.keys(PeriodOption)),
			errorMessage:
				'Invalid frequency. Options include ' +
				Object.keys(PeriodOption)
		},
		onWeekdays: {
			test: onWeekdays => {
				for (const weekday of onWeekdays) {
					if (!isIn(weekday, Object.keys(WeekDays))) {
						return false
					}
				}
				return true
			},
			errorMessage:
				'Invalid Weekday. Options include ' + Object.keys(WeekDays)
		},
		endRepeat: {
			test: endRepeat => isISO8601(endRepeat, { strict: true }),
			errorMessage: invalidISO8601Message
		},
		exception: {
			startTime: {
				test: startTime => isISO8601(startTime, { strict: true }),
				errorMessage: invalidISO8601Message
			},
			endTime: {
				test: endTime => isISO8601(endTime, { strict: true }),
				errorMessage: invalidISO8601Message
			},
			removed: {
				test: removed => isBoolean(removed),
				errorMessage: 'Invalid boolean value'
			}
		}
	}
}
