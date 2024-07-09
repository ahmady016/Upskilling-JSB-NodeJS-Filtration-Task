import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsOptional, Length, validate } from 'class-validator'
import asyncHandler from 'express-async-handler'

import db from '../db/fakeDB/db.json'
import { Team } from './../db/types'
import { ApiError } from '../errorHandlerMiddleware'

import { writeFakeDb } from '../db/fakeDB/seed'
import Chance from 'chance'
const ch = new Chance()

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

    // transform createdTeamInput to Team and Add to database
    const createdTeam = plainToInstance(Team, {
        id: ch.guid(),
        ...createdTeamInput,
        createdAt: new Date().toISOString(),
        updatedAt: '',
    })
    db.teams.push(createdTeam)

    // save to fakeDB
    writeFakeDb(db)

    // return created team
    res.json(createdTeam)
}

export default asyncHandler(createTeamEndpointHandler)
