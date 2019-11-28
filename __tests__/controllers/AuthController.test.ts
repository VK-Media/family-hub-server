import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../src/app'
import { UserModel } from '../../src/models'
const testUser = {
	name: 'Mr. Test',
	email: 'test@example.com',
	password: 'ThisIsASuccessfullPassword!'
}

beforeAll(async () => {
	// UserModel.db.
})

describe('Login endpoint', () => {
	it('should create user to login with', async () => {
		const res = await request(app)
			.post('/user')
			.send(testUser)
		expect(res.status).toEqual(201)
		expect(res.body).toHaveProperty('user')
		expect(res.body).toHaveProperty('jwt')
		console.log(res)
	})
	it('should create jwt and send it back', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({
				email: testUser.email,
				password: testUser.password
			})
		expect(res.status).toEqual(200)
		expect(res.body).toHaveProperty('jwt')
	})
})
