import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, Length, validate } from 'class-validator'
import asyncHandler from 'express-async-handler'

import db from '../db/fakeDB/db.json'
import { Task, TaskStatus } from './../db/types'
import { ApiError } from '../errorHandlerMiddleware'

import { writeFakeDb } from '../db/fakeDB/seed'
import Chance from 'chance'
const ch = new Chance()

export class CreateOrUpdateTaskInput {
    @IsNotEmpty({ message: 'Title is required' })
    @Length(7, 100, { message: 'Title must be between 7 and 100 characters' })
    title!: string

    @IsOptional()
    @Length(0, 600, { message: 'Description must be between 0 and 600 characters' })
    description: string

    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(TaskStatus, { message: 'Status must be OPEN, IN_PROGRESS or DONE' })
    status!: TaskStatus

    @IsNotEmpty({ message: 'AssignedTo is required' })
    assignedTo!: string

    @IsNotEmpty({ message: 'DueDate is required' })
    @IsDateString()
    dueDate!: string

    @IsOptional()
    @IsDateString()
    startDate: string

    @IsOptional()
    @IsDateString()
    endDate: string

}
async function createTaskEndpointHandler(
	req: Request<unknown, unknown, CreateOrUpdateTaskInput>,
	res: Response<Task | ApiError>
) {
    // transform input to class and validate
    const createdTaskInput = plainToInstance(CreateOrUpdateTaskInput, req.body)
    const errors = await validate(createdTaskInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors)
    }

    // transform createdTaskInput to Task and Add to database
    const createdTask = plainToInstance(Task, {
        id: ch.guid(),
        ...createdTaskInput,
        createdAt: new Date().toISOString(),
        updatedAt: '',
    })
    db.tasks.push(createdTask)

    // save to fakeDB
    writeFakeDb(db)

    // return created Task
    res.json(createdTask)
}

export default asyncHandler(createTaskEndpointHandler)
