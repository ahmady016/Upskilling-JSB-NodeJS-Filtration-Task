import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { Prisma, TeamMember } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { PageQueryInput } from '../teams/findAllTeams.endpoint'
import prisma from '../prisma'

async function findAllMembersEndpointHandler(
    req: Request<unknown, unknown, unknown, PageQueryInput>,
    res: Response<TeamMember[]>
) {
	let queryOptions: Prisma.TeamMemberFindManyArgs = {
		orderBy: {
			name: 'asc'
		}
	}

	if(req.query.pageNumber && req.query.pageSize) {
		const { pageNumber, pageSize } = plainToInstance(PageQueryInput, req.query)
		queryOptions = {
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
			include: {
				tasks: {
					select: { title: true, status: true, dueDate: true }
				}
			},
			...queryOptions,
		}
	}

	const teamMembers = await prisma.teamMember.findMany(queryOptions)
	res.json(teamMembers)
}

export default asyncHandler(findAllMembersEndpointHandler)
