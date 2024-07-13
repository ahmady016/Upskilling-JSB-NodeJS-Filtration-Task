import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance, Transform } from 'class-transformer'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Prisma, Team } from '@prisma/client'

import prisma from '../prisma'

export class PageQueryInput {
	@Transform(({ value }) => Number(value))
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(1)
	@IsOptional()
	pageSize?: number = 10

	@Transform(({ value }) => Number(value))
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(1)
	@Max(100)
	@IsOptional()
	pageNumber?: number = 1
}
async function findAllTeamsEndpointHandler(
	req: Request<unknown, unknown, unknown, PageQueryInput>,
	res: Response<Team[]>
) {
	let queryOptions: Prisma.TeamFindManyArgs = {
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
				members: {
					select: { name: true, email: true }
				}
			},
			...queryOptions,
		}
	}

	const teams = await prisma.team.findMany(queryOptions as Prisma.TeamFindManyArgs)
	res.json(teams)
}

export default asyncHandler(findAllTeamsEndpointHandler)
