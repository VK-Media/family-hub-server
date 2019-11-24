import { Request } from 'express'

export interface LoginInput extends Request {
	body: {
		email: string
		password: string
	}
}
