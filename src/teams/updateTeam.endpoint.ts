import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsOptional, Length, validate } from 'class-validator'

import db from '../db/fakeDB/db.json'
import { Team } from './../db/types'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'

class UpdateTeamInput {
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name!: string

    @IsOptional()
    @Length(0, 600, { message: 'Description must be between 0 and 600 characters' })
    description: string
}

export default async function updateTeamEndpointHandler(
    req: Request<{ id: string }, unknown, UpdateTeamInput>,
    res: Response<Team>
) {
    // transform input to class and validate
    const updatedTeamInput = plainToInstance(UpdateTeamInput, req.body)
    const errors = await validate(updatedTeamInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors)
    }

    // Find team
    const teamId = req.params.id
    const foundTeam = db.teams.find((team) => team.id === teamId)
    // Check if team exists and throw error if not
    if(!foundTeam) {
        throw new ApiError(`Team with Id ${teamId} not found`, 404)
    }

    // Update team
    foundTeam.name = updatedTeamInput.name
    foundTeam.description = updatedTeamInput.description
    foundTeam.updatedAt = new Date().toISOString()

    // save to fakeDB
    writeFakeDb(db)

    // return updated team
    res.json(foundTeam)
}
