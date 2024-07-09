import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteMemberEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    // Find task
    const taskId = req.params.id
    const foundTask = await prisma.task.findUnique({ where: { id: taskId } })
    // Check if task exists and throw error if not
    if(!foundTask) {
        throw new ApiError(`Task with Id ${taskId} not found`, 404)
    }

    // Delete task using prisma
    const deletedTask = await prisma.task.delete({ where: { id: taskId } })

    // return success message
    res.json(`Team with id ${deletedTask.id} deleted successfully`)
}

export default asyncHandler(deleteMemberEndpointHandler)
