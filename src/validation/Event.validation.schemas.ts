import { isBoolean, isIn, isISO8601 } from 'validator'

import { PeriodOption, WeekDays } from '../interfaces/Event.interfaces'
import { ValidateSchema } from './Validator'

const invalidISO8601Message = 'Not following ISO8601 standard'

export const timeDetailsCreate: ValidateSchema = {
	startTime: {
		required: userInput => {
			// If all day is set startTime is NOT required
			return !userInput.allDay
		},
		test: (startTime, userInput) => {
			const valid = isISO8601(startTime, { strict: true })
			if (!valid && !userInput.allDay) return invalidISO8601Message
			else return ''
		}
	},
	endTime: {
		required: userInput => {
			// If all day is set startTime is NOT required
			return !userInput.allDay
		},
		test: (endTime, userInput) => {
			const valid = isISO8601(endTime, { strict: true })
			if (!valid && !userInput.allDay) return invalidISO8601Message
			else return ''
		}
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
				return ''
			} else return invalidISO8601Message
		}
	},
	repeat: {
		frequency: {
			required: userInput => {
				if (userInput.repeat) return true
				else return false
			},
			test: frequency => {
				if (isIn(frequency, Object.keys(PeriodOption))) {
					return ''
				} else {
					return (
						'Invalid frequency. Options include ' +
						Object.keys(PeriodOption)
					)
				}
			}
		},
		onWeekdays: {
			test: onWeekdays => {
				for (const weekday of onWeekdays) {
					if (!isIn(weekday, Object.keys(WeekDays))) {
						return (
							'Invalid Weekday. Options include ' +
							Object.keys(WeekDays)
						)
					}
				}
				return ''
			}
		},
		endRepeat: {
			test: endRepeat => {
				if (isISO8601(endRepeat, { strict: true })) return ''
				else return invalidISO8601Message
			}
		}
	}
}

export const timeDetailsUpdate: ValidateSchema = {
	startTime: {
		test: startTime => {
			if (isISO8601(startTime, { strict: true })) return ''
			else return invalidISO8601Message
		}
	},
	endTime: {
		test: endTime => {
			if (isISO8601(endTime, { strict: true })) return ''
			else return invalidISO8601Message
		}
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
				return ''
			} else return invalidISO8601Message
		}
	},
	repeat: {
		frequency: {
			test: frequency => {
				if (isIn(frequency, Object.keys(PeriodOption))) return ''
				else {
					return (
						'Invalid frequency. Options include ' +
						Object.keys(PeriodOption)
					)
				}
			}
		},
		onWeekdays: {
			test: onWeekdays => {
				for (const weekday of onWeekdays) {
					if (!isIn(weekday, Object.keys(WeekDays))) {
						return (
							'Invalid Weekday. Options include ' +
							Object.keys(WeekDays)
						)
					}
				}
				return ''
			}
		},
		endRepeat: {
			test: endRepeat => {
				if (isISO8601(endRepeat, { strict: true })) return ''
				else return invalidISO8601Message
			}
		},
		exception: {
			startTime: {
				test: startTime => {
					if (isISO8601(startTime, { strict: true })) return ''
					else return invalidISO8601Message
				}
			},
			endTime: {
				test: endTime => {
					if (isISO8601(endTime, { strict: true })) return ''
					else return invalidISO8601Message
				}
			},
			removed: {
				test: removed => {
					if (isBoolean(removed)) return ''
					else return 'Invalid bool value'
				}
			}
		}
	}
}
