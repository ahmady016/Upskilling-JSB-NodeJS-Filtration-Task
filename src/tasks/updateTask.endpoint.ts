import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Task } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { CreateOrUpdateTaskInput } from './createTask.endpoint'
import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

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
    // check if team member exists and throw error if not
    const foundMember = await prisma.team.findUnique({ where: { id: updatedTaskInput.assignedTo } })
    if(!foundMember) {
        throw new ApiError(`Team Member with Id ${updatedTaskInput.assignedTo} Not Found`, 404)
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
