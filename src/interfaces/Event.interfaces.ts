import { Document, Types } from 'mongoose'
import { UserModel } from './User.interfaces'

export enum WeekDays { // TODO: Find a more optimal way to do this
	Monday = 'M',
	Tuesday = 'T',
	Wednesday = 'W',
	Thursday = 'T',
	Friday = 'F',
	Saturday = 'S',
	Sunday = 'S'
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
		everyPeriod: number
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
	participants: UserModel
}
