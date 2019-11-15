import mongoose from 'mongoose'

import {
	EventModel,
	PeriodOption,
	WeekDays
} from '../interfaces/Event.interfaces'
import {
	eventDescriptionMaxLength,
	eventRef,
	eventTitleMaxLength,
	userRef
} from '../util/Schemas.util'

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
			type: {
				startTime: { type: Date, required: true },
				endTime: { type: Date },
				repeat: {
					onWeekdays: [
						{
							type: String,
							enum: Object.keys(WeekDays),
							required: true
						}
					],
					frequency: {
						type: String,
						enum: Object.keys(PeriodOption),
						required: true
					},
					everyFrequency: { type: Number, required: true },
					endRepeat: { type: Date }
				}
			},
			required: true
		},
		alert: {
			type: Date
		},
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: userRef }]
	},
	{
		timestamps: true
	}
)

EventSchema.methods.toJSON = function() {
	const eventObject: EventModel = this.toObject()
	delete eventObject.__v
	return eventObject
}

export default mongoose.model<EventModel>(eventRef, EventSchema)
