import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { PrismaClient, Team } from '@prisma/client'
const prisma = new PrismaClient()

async function findAllTeamsEndpointHandler(
	_: Request,
	res: Response<Team[]>
) {
	const teams = await prisma.team.findMany()
	res.json(teams)
}

export default asyncHandler(findAllTeamsEndpointHandler)
