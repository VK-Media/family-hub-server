import { isBoolean, isIn, isInt, isISO8601 } from 'validator'

import { PeriodOption, WeekDays } from '../interfaces/Event.interfaces'
import { isObject } from './Objects.util'

const invalidISO8601Message = 'Not following ISO8601 standard'

export const validateEventTimeDetails = (timeDetails: any) => {
	const errors = { repeat: {} }

	validateStartAndEndTime(timeDetails, errors)

	if ('repeat' in timeDetails) {
		if (isObject(timeDetails.repeat)) {
			if ('frequency' in timeDetails.repeat) {
				if (
					!isIn(
						timeDetails.repeat.frequency,
						Object.keys(PeriodOption)
					)
				) {
					errors.repeat['frequency'] =
						'Invalid Period Option. Options include: ' +
						Object.keys(PeriodOption)
				} else {
					if (timeDetails.repeat.frequency === PeriodOption.Weekly) {
						if ('onWeekdays' in timeDetails.repeat) {
							if (
								!isIn(
									timeDetails.repeat.onWeekdays,
									Object.keys(WeekDays)
								)
							) {
								errors.repeat['onWeekdays'] =
									'Invalid week day. Options include: ' +
									Object.keys(WeekDays)
							}
						} else {
							errors.repeat['onWeekdays'] =
								'Required with a weekly frequency'
						}
					}
				}
			} else {
				errors.repeat['frequency'] = 'Required'
			}

			if ('endRepeat' in timeDetails.repeat) {
				if (
					!isISO8601(timeDetails.repeat.endRepeat, {
						strict: true
					})
				) {
					errors.repeat['endRepeat'] = invalidISO8601Message
				}
			}
		} else {
			errors.repeat = 'Not a valid object'
		}
	}

	if (Object.keys(errors.repeat).length === 0) delete errors.repeat

	if (Object.keys(errors).length !== 0) {
		return errors
	} else return false
}

const validateStartAndEndTime = (timeDetails: any, errorsOutput: {}) => {
	if ('allDay' in timeDetails) {
		if (!isISO8601(timeDetails.allDay, { strict: true })) {
			errorsOutput['allDay'] = invalidISO8601Message
		} else {
			const allDayDate = new Date(timeDetails.allDay)
			const startTimeDate = new Date(allDayDate.setHours(0, 0, 0, 0))
			const endTimeDate = new Date(allDayDate.setHours(23, 59, 59, 999))
			timeDetails.startTime = startTimeDate
			timeDetails.endTime = endTimeDate
			timeDetails.allDay = true
		}
	} else {
		if ('startTime' in timeDetails) {
			if (!isISO8601(timeDetails.startTime, { strict: true })) {
				errorsOutput['startTime'] = invalidISO8601Message
			}
		} else {
			errorsOutput['startTime'] = 'Required'
		}

		if ('endTime' in timeDetails) {
			if (!isISO8601(timeDetails.startTime, { strict: true })) {
				errorsOutput['endTime'] = invalidISO8601Message
			}
		} else {
			errorsOutput['endTime'] = 'Required'
		}
	}
}

export const validateEventTimeDetailsUpdate = (timeDetails: any) => {
	const errors = validateEventTimeDetails(timeDetails)

	const exceptionErrors = { repeat: { exceptions: {} } }

	if ('repeat' in timeDetails) {
		if (isObject(timeDetails.repeat)) {
			if ('exceptions' in timeDetails.repeat) {
				if (!isObject(timeDetails.exceptions)) {
					exceptionErrors.repeat.exceptions = 'Not a valid object'
				} else {
					if ('exceptions.startTime' in timeDetails.exceptions) {
						if (!isISO8601(timeDetails.exceptions.startTime)) {
							exceptionErrors.repeat.exceptions[
								'startTime'
							] = invalidISO8601Message
						}
					} else {
						exceptionErrors.repeat.exceptions['startTime'] =
							'Required'
					}

					if ('exceptions.endTime' in timeDetails.exceptions) {
						if (!isISO8601(timeDetails.exceptions.endTime)) {
							exceptionErrors.repeat.exceptions[
								'endTime'
							] = invalidISO8601Message
						}
					} else {
						exceptionErrors.repeat.exceptions['endTime'] =
							'Required'
					}

					if ('exceptions.removed' in timeDetails.exceptions) {
						if (!isBoolean(timeDetails.exceptions.removed)) {
							exceptionErrors.repeat.exceptions['removed'] =
								'Invalid boolean value'
						}
					}
				}
			}
		} else {
			errors['repeat'] = 'Not a valid object'
		}
	}

	// If errors were found from validateEventTimeDetails then include these aswell as exceptionErrors
	if (errors) {
		return { ...errors, ...exceptionErrors }
	} else {
		// No other errors from other fields than exceptions were found,
		// Then check if errors were found in exceptions, and return them or false if not
		if (Object.keys(exceptionErrors.repeat.exceptions).length !== 0) {
			return exceptionErrors
		} else return false
	}
}
