import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsOptional, Length, validate } from 'class-validator'
import { Team } from '@prisma/client'

import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

class UpdateTeamInput {
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name!: string

    @IsOptional()
    @Length(0, 600, { message: 'Description must be between 0 and 600 characters' })
    description: string
}

async function updateTeamEndpointHandler(
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
    const foundTeam = await prisma.team.findUnique({ where: { id: teamId } })
    // Check if team exists and throw error if not
    if(!foundTeam) {
        throw new ApiError(`Team with Id ${teamId} not found`, 404)
    }

    // Update team using prisma
    const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: updatedTeamInput
    })

    // return updated team
    res.json(updatedTeam)
}

export default asyncHandler(updateTeamEndpointHandler)
