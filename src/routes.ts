import { Application } from 'express'

import teamsRouter from './teams/router'
import teamMembersRouter from './members/router'

export default function registerApiRoutes(app: Application) {
	app.use('/api/teams', teamsRouter)
	app.use('/api/teamMembers', teamMembersRouter)
}
