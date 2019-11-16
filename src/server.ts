import app from './App'

const PORT = process.env.HTTP_PORT || 5000

app.listen(PORT, () => {
	console.log('Server is running on: ' + PORT)
})
