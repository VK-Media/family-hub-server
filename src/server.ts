import expressApp from './App'

const PORT = process.env.HTTP_PORT || 5000

expressApp.listen(PORT, () => {
	console.log('🚀 Server is running on: ' + PORT)
})
