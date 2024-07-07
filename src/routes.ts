import { Application, Response } from 'express'
import { ApiError } from './errorHandlerMiddleware'

export default function registerApiRoutes(app: Application) {
	app.use('/api', (_, res: Response) => {
		throw new ApiError('Not Found', 404, '/api')
		res.send('Hello There, The Web Server is Running')
	})
}
