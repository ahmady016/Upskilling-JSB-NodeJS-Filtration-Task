import { Router } from 'express'

import findAllTeamsEndpointHandler from './findAllTeams.endpoint'
import findOneTeamEndpointHandler from './findOneTeam.endpoint'
import createTeamEndpointHandler from './createTeam.endpoint'
import updateTeamEndpointHandler from './updateTeam.endpoint'
import deleteTeamEndpointHandler from './deleteTeam.endpoint'

const teamsRouter = Router()

teamsRouter.get('/list', findAllTeamsEndpointHandler)
teamsRouter.get('/:id', findOneTeamEndpointHandler)
teamsRouter.post('/create', createTeamEndpointHandler)
teamsRouter.put('/:id', updateTeamEndpointHandler)
teamsRouter.delete('/:id', deleteTeamEndpointHandler)

export default teamsRouter
