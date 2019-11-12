import { Request } from 'express'
import { Document, Types } from 'mongoose'
import { UserModel } from './User.interfaces'

export enum WeekDays { // TODO: Find a more optimal way to do this
	Monday = 'Monday',
	Tuesday = 'Tuesday',
	Wednesday = 'Wednesday',
	Thursday = 'Thursday',
	Friday = 'Friday',
	Saturday = 'Saturday',
	Sunday = 'Sunday'
}

export enum PeriodOption {
	Daily = 'DAILY',
	Weekly = 'WEEKLY',
	Monthly = 'MONTHLY',
	Yearly = 'Yearly'
}

export interface TimeDetails {
	startTime: Date
	endTime?: Date // null for all-day option
	repeat?: {
		onWeekdays: WeekDays[]
		frequency: PeriodOption
		everyFrequency: number
		endRepeat?: Date
	}
}

export interface EventModel extends Document {
	_id: Types.ObjectId
	title: string
	description: string
	location?: string // TODO - Own model perhaps
	timeDetails: TimeDetails
	alert?: Date
	participants: [UserModel]
}

export interface CreateEventInput extends Request {
	body: {
		title: string
		description: string
		location?: string
		timeDetails: TimeDetails
		alert?: Date
		participants: [string]
	}
}
