import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { ApiError } from '../errorHandlerMiddleware'
import { CreateOrUpdateTaskInput } from './createTask.endpoint'

import { PrismaClient, Task } from '@prisma/client'
const prisma = new PrismaClient()

async function updateMemberEndpointHandler(
    req: Request<{ id: string }, unknown, CreateOrUpdateTaskInput>,
    res: Response<Task>
) {
    // transform input to class and validate
    const updatedTaskInput = plainToInstance(CreateOrUpdateTaskInput, req.body)
    const errors = await validate(updatedTaskInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation Failed', 400, errors)
    }

    // Find task
    const taskId = req.params.id
    const foundTask = await prisma.task.findUnique({ where: { id: taskId } })
    // Check if task exists and throw error if not
    if(!foundTask) {
        throw new ApiError(`Task with Id ${taskId} not found`, 404)
    }

    // Update task using prisma
    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updatedTaskInput
    })

    // return updated team member
    res.json(updatedTask)
}

export default asyncHandler(updateMemberEndpointHandler)
