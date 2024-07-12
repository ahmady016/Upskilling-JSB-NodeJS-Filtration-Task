import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Team } from '@prisma/client'

import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

type FindOneTeamQuery = {
	id: string
}
async function findOneTeamEndpointHandler(
	req: Request<FindOneTeamQuery>,
	res: Response<Team>
) {
	const teamId = req.params.id
	const foundTeam = await prisma.team.findUnique({ where: { id: teamId } })
	if(!foundTeam) {
		throw new ApiError(`Team with Id ${teamId} not found`, 404)
	}

	res.json(foundTeam)
}

export default asyncHandler(findOneTeamEndpointHandler)
