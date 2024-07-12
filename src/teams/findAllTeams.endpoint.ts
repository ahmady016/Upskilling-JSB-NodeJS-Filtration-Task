import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance, Transform } from 'class-transformer'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Team } from '@prisma/client'

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
	let teams:Team[]
	if(req.query.pageNumber && req.query.pageSize) {
		const { pageNumber, pageSize } = plainToInstance(PageQueryInput, req.query)
		teams = await prisma.team.findMany({
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
		})
	} else {
		teams = await prisma.team.findMany()
	}
	res.json(teams)
}

export default asyncHandler(findAllTeamsEndpointHandler)
