import { Request } from 'express'
import { Document, Types } from 'mongoose'

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
	Yearly = 'YEARLY'
}

export interface IEventException {
	startTime: Date
	endTime: Date
	removed?: boolean
}

export interface TimeDetails {
	startTime: Date
	endTime: Date
	allDay?: boolean
	repeat?: {
		// TODO: Make this very customizable in future
		frequency: PeriodOption
		onWeekdays?: WeekDays[] // NOTE: If frequency is weekly, days should be chooseable
		endRepeat?: Date
		exceptions?: IEventException[]
	}
}

export interface IEventModel extends Document {
	_id: Types.ObjectId
	title: string
	description?: string
	location?: string // TODO: Google API for location
	timeDetails: TimeDetails
	alert?: Date
	participants: Types.ObjectId[]
	deleted: boolean
	// TODO: Deleted ALL objects, automatic deletion from database later, like facebook
}

export interface CreateTimeDetails {
	startTime?: Date
	endTime?: Date
	allDay?: boolean
	repeat?: {
		frequency: PeriodOption
		onWeekdays?: WeekDays[]
		endRepeat?: Date
		exceptions?: IEventException[]
	}
}

export interface CreateEventInput extends Request {
	body: {
		title: string
		description?: string
		location?: string
		timeDetails: CreateTimeDetails
		alert?: Date
		participants: string[]
	}
}

// tslint:disable-next-line: no-empty-interface
export interface GetEventInput extends Request {
	// TODO: Security
}

export interface GetEventByIdInput extends Request {
	params: {
		eventId: string
	}
}

export interface IEventExceptionUpdate {
	startTime?: Date
	endTime?: Date
	removed?: boolean
}

export interface TimeDetailsUpdate {
	startTime?: Date
	endTime?: Date
	allDay?: Date
	repeat?: {
		frequency?: PeriodOption
		onWeekdays?: WeekDays[] // NOTE: conditional based on frequency
		endRepeat?: Date
		exceptions?: IEventExceptionUpdate[]
	}
}

export interface UpdateEventInput extends Request {
	params: {
		eventId: string
	}
	body: {
		title?: string
		description?: string
		location?: string
		timeDetails?: TimeDetailsUpdate
		alert?: Date
		participants?: string[]
	}
}

export interface DeleteEventInput extends Request {
	params: {
		eventId: string
	}
}
