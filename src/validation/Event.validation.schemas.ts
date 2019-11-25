import { isBoolean, isIn, isISO8601 } from 'validator'

import { PeriodOption, WeekDays } from '../interfaces/Event.interfaces'
import { ValidateSchema } from './Validator'

const invalidISO8601Message = 'Not following ISO8601 standard'

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
		test: allDay => isISO8601(allDay, { strict: true }),
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
			test: onWeekdays => isIn(onWeekdays, Object.keys(WeekDays)),
			errorMessage:
				'Invalid Weekday. Options include ' + Object.keys(WeekDays)
		},
		endRepeat: {
			test: endRepeat => isISO8601(endRepeat, { strict: true }),
			errorMessage: invalidISO8601Message
		},
		exceptions: {
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