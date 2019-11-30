db.auth('admin-user', 'admin-password')
db.createUser({
	user: 'test',
	pwd: 'test',
	roles: [
		{
			role: 'readWrite',
			db: 'family-test'
		}
	]
})
