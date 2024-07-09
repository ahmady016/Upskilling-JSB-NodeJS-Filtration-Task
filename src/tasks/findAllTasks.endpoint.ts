import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { PrismaClient, Task } from '@prisma/client'
const prisma = new PrismaClient()

async function findAllTasksEndpointHandler(
	_: Request,
	res: Response<Task[]>
) {
	const tasks = await prisma.task.findMany()
	res.json(tasks)
}

export default asyncHandler(findAllTasksEndpointHandler)
