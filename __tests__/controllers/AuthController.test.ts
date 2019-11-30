import mongoose from 'mongoose'
import request from 'supertest'
import expressApp from '../../src/App'
import { UserModel } from '../../src/models/index'

const testUser = {
	name: 'Mr. Test',
	email: 'test@example.com',
	password: 'ThisIsASuccessfullPassword!'
}

beforeAll(async () => {
	const users = await UserModel.find()
	if (users) {
		for (const user of users) {
			await user.remove()
		}
	}
})

afterAll(async () => {
	await mongoose.connection.close()
})

describe('Login endpoint', () => {
	test('should create user to login with', async () => {
		console.log('LOGIN ENDPOINT, BEFORE')
		const res = await request(expressApp)
			.post('/user')
			.send(testUser)
			.expect(201)

		expect(res.body).toHaveProperty('user')
		expect(res.body).toHaveProperty('jwt')
		console.log('LOGIN ENDPOINT, AFTER')
	})
})

describe('login endpoint test', () => {
	test('should create jwt and send it back', async () => {
		console.log('LOGIN ENDPOINT JWT, BEFORE')

		const res = await request(expressApp)
			.post('/auth')
			.send({
				email: testUser.email,
				password: testUser.password
			})
			.expect(200)
		expect(res.body).toHaveProperty('jwt')
		console.log('LOGIN ENDPOINT JWT, AFTER')
	})
})
