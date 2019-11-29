import mongoose from 'mongoose'

import {
	IEventModel,
	PeriodOption,
	WeekDays
} from '../interfaces/Event.interfaces'
import {
	eventDescriptionMaxLength,
	eventRef,
	eventTitleMaxLength,
	userRef
} from '../util/Schemas.util'
import UserModel from './User.model'

const EventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			maxlength: eventTitleMaxLength,
			required: true,
			trim: true
		},
		description: {
			type: String,
			maxlength: eventDescriptionMaxLength,
			default: ''
		},
		location: {
			type: String,
			trim: true
		},
		timeDetails: {
			startTime: { type: Date, required: true },
			endTime: { type: Date, required: true },
			allDay: { type: Boolean, default: false },
			repeat: {
				frequency: {
					type: String,
					enum: Object.keys(PeriodOption),
					required() {
						const repeatValues = Object.values(
							this.timeDetails.repeat.toObject()
						)
						const userSetFields = repeatValues.filter(val => {
							if (val !== undefined) return val
						})
						// If The user has not specified anything in repeat object this field is not required
						return userSetFields.length === 0 ? false : true
					}
				},
				onWeekdays: [
					{
						type: String,
						enum: Object.keys(WeekDays),
						required: false
					}
				],
				endRepeat: { type: Date },
				exceptions: [
					{
						startTime: { type: Date, required: true },
						endTime: { type: Date, required: true },
						removed: { type: Boolean, required: false }
					}
				]
			}
		},
		alert: {
			type: Date
		},
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: userRef }],
		deleted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
)

EventSchema.pre('validate', function(this: IEventModel, next) {
	const event = this
	// OnWeekdays should not be set unless it is a weekly event
	if (event.timeDetails.repeat.frequency !== PeriodOption.Weekly)
		event.timeDetails.repeat.onWeekdays = undefined

	// exceptions should only be set if it's an update
	if (event.isNew) {
		event.timeDetails.repeat.exceptions = undefined
	}
	next()
})

EventSchema.pre('remove', async function(this: IEventModel, next) {
	const eventToRemove = this

	const participants = await UserModel.find({
		_id: {
			$in: eventToRemove.participants
		}
	})

	for (const participant of participants) {
		participant.events = participant.events.filter(
			eventId => !eventId.equals(eventToRemove._id)
		)

		try {
			await participant.save()
		} catch (error) {
			console.error('Event pre remove - Event save', error.message)
			throw error
		}
	}

	next()
})

EventSchema.methods.toJSON = function() {
	const eventObject: IEventModel = this.toObject()
	delete eventObject.__v
	delete eventObject.deleted
	const id = eventObject._id
	delete eventObject._id
	eventObject['id'] = id
	return eventObject
}

export default mongoose.model<IEventModel>(eventRef, EventSchema)
