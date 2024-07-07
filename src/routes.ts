import { Application, Response } from 'express'

export default function registerApiRoutes(app: Application) {
	app.use('/api', (_, res: Response) => void res.send('Hello There, The Web Server is Running'))
}
