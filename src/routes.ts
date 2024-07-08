import { Application } from 'express'
import teamsRouter from './teams/router'

export default function registerApiRoutes(app: Application) {
	app.use('/api/teams', teamsRouter)
}
