import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { Task } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { PageQueryInput } from '../teams/findAllTeams.endpoint'
import prisma from '../prisma'

async function findAllTasksEndpointHandler(
	req: Request<unknown, unknown, unknown, PageQueryInput>,
	res: Response<Task[]>
) {
	let tasks:Task[]
	if(req.query.pageNumber && req.query.pageSize) {
		const { pageNumber, pageSize } = plainToInstance(PageQueryInput, req.query)
		tasks = await prisma.task.findMany({
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
		})
	} else {
		tasks = await prisma.task.findMany()
	}
	res.json(tasks)
}

export default asyncHandler(findAllTasksEndpointHandler)
