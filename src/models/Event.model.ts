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

EventSchema.pre('remove', async function(this: IEventModel, next) {
	const eventToRemove = this

	UserModel.find({
		_id: {
			$in: eventToRemove.participants
		}
	}).then(participants => {
		for (const participant of participants) {
			participant.events = participant.events.filter(
				eventId => !eventId.equals(eventToRemove._id)
			)
			participant.save().catch((err: Error) => {
				throw err
			})
		}
	})

	next()
})

EventSchema.methods.toJSON = function() {
	const eventObject: IEventModel = this.toObject()
	delete eventObject.__v
	return eventObject
}

export default mongoose.model<IEventModel>(eventRef, EventSchema)
