import { Request, Response } from 'express'
import { Task } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

type FindOneTaskQuery = {
	id: string
}
async function findOneTaskEndpointHandler(
	req: Request<FindOneTaskQuery>,
	res: Response<Task>
) {
    // Find task
    const taskId = req.params.id
    const foundTask = await prisma.task.findUnique({ where: { id: taskId } })
    // Check if task exists and throw error if not
    if(!foundTask) {
        throw new ApiError(`Task with Id ${taskId} not found`, 404)
    }
	// return found task
	res.json(foundTask)
}

export default asyncHandler(findOneTaskEndpointHandler)
