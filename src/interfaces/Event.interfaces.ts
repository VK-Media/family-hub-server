import { Request } from 'express'
import { Document, Types } from 'mongoose'
import { IUserModel } from './User.interfaces'

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
	location?: string // TODO: Own model perhaps
	timeDetails: TimeDetails
	alert?: Date
	participants: Types.ObjectId[]
	// TODO: Family event instead of user event?
}

export interface CreateEventInput extends Request {
	body: {
		title: string
		description: string
		location?: string
		timeDetails: TimeDetails
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

export interface UpdateEventInput extends Request {
	params: {
		eventId: string
	}
	body: {
		title?: string
		description?: string
		location?: string
		timeDetails?: TimeDetails
		alert?: Date
		participants?: string[]
	}
}

export interface DeleteEventInput extends Request {
	params: {
		eventId: string
	}
}
