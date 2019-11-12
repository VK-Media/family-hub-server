import mongoose from 'mongoose'

import {
	EventModel,
	PeriodOption,
	WeekDays
} from '../interfaces/Event.interfaces'
import { eventRef, userRef } from '../util/DbModelsRef'

const EventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			maxlength: 20,
			required: true,
			trim: true
		},
		description: {
			type: String,
			maxlength: 750,
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
						enum: Object.keys(PeriodOption)
					},
					everyPeriod: { type: Number },
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

export default mongoose.model<EventModel>(eventRef, EventSchema)
