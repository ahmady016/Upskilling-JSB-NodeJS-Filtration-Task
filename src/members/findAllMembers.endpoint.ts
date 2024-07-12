import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { TeamMember } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { PageQueryInput } from '../teams/findAllTeams.endpoint'
import prisma from '../prisma'

async function findAllMembersEndpointHandler(
    req: Request<unknown, unknown, unknown, PageQueryInput>,
    res: Response<TeamMember[]>
) {
	let teamMembers:TeamMember[]
	if(req.query.pageNumber && req.query.pageSize) {
		const { pageNumber, pageSize } = plainToInstance(PageQueryInput, req.query)
		teamMembers = await prisma.teamMember.findMany({
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
		})
	} else {
		teamMembers = await prisma.teamMember.findMany()
	}
	res.json(teamMembers)
}

export default asyncHandler(findAllMembersEndpointHandler)
