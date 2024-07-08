import { Router } from 'express'

import findAllEndpointHandler from './findAll.endpoint'
import findOneEndpointHandler from './findOne.endpoint'
import createTeamEndpointHandler from './createTeam.endpoint'
import updateTeamEndpointHandler from './updateTeam.endpoint'
import deleteTeamEndpointHandler from './deleteTeam.endpoint'

const teamsRouter = Router()

teamsRouter.get('/list', findAllEndpointHandler)
teamsRouter.get('/:id', findOneEndpointHandler)
teamsRouter.post('/create', createTeamEndpointHandler)
teamsRouter.put('/:id', updateTeamEndpointHandler)
teamsRouter.delete('/:id', deleteTeamEndpointHandler)

export default teamsRouter
