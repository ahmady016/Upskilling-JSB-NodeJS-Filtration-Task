import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsOptional, Length, validate } from 'class-validator'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'

import { PrismaClient, Team } from '@prisma/client'
const prisma = new PrismaClient()

class CreateTeamInput {
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name!: string

    @IsOptional()
    @Length(0, 600, { message: 'Description must be between 0 and 600 characters' })
    description: string
}
async function createTeamEndpointHandler(
	req: Request<unknown, unknown, CreateTeamInput>,
	res: Response<Team | ApiError>
) {
    // transform input to class and validate
    const createdTeamInput = plainToInstance(CreateTeamInput, req.body)
    const errors = await validate(createdTeamInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors)
    }

    // Add to database using prisma
    const team = await prisma.team.create({ data: createdTeamInput })

    // return created team
    res.json(team)
}

export default asyncHandler(createTeamEndpointHandler)
