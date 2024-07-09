import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'

import { PrismaClient, Team } from '@prisma/client'
const prisma = new PrismaClient()

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
