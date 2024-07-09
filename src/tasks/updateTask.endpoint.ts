import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import db from '../db/fakeDB/db.json'
import { Task } from '../db/types'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'
import { CreateOrUpdateTaskInput } from './createTask.endpoint'

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

    // Find team member
    const taskId = req.params.id
    const foundTask = db.tasks.find((task) => task.id === taskId)
    // Check if team exists and throw error if not
    if(!foundTask) {
        throw new ApiError(`Task with Id ${taskId} not found`, 404)
    }

    // Update team member
    foundTask.id = taskId
    foundTask.title = updatedTaskInput.title
    foundTask.description = updatedTaskInput.description
    foundTask.status = updatedTaskInput.status
    foundTask.dueDate = updatedTaskInput.dueDate
    foundTask.startDate = updatedTaskInput.startDate
    foundTask.endDate = updatedTaskInput.endDate
    foundTask.assignedTo = updatedTaskInput.assignedTo
    foundTask.updatedAt = new Date().toISOString()

    // save to fakeDB
    writeFakeDb(db)

    // return updated team member
    res.json(plainToInstance(Task, foundTask))
}

export default asyncHandler(updateMemberEndpointHandler)
