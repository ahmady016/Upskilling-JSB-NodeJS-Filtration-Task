import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, Length, IsEmail, IsDateString, IsEnum, IsUUID, validate } from 'class-validator'
import { TeamMember } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { Gender } from '../db/types'
import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

export class CreateOrUpdateTeamMemberInput {
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name!: string

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email!: string

    @IsNotEmpty({ message: 'BirthDate is required' })
    @IsDateString()
    birthDate!: string

    @IsNotEmpty({ message: 'Gender is required' })
    @IsEnum(Gender)
    gender!: string

    @IsNotEmpty({ message: 'TeamId is required' })
    @IsUUID()
    teamId!: string
}
async function createMemberEndpointHandler(
	req: Request<unknown, unknown, CreateOrUpdateTeamMemberInput>,
	res: Response<TeamMember | ApiError>
) {
    // transform input to class and validate
    const createdTeamMemberInput = plainToInstance(CreateOrUpdateTeamMemberInput, req.body)
    const errors = await validate(createdTeamMemberInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation Failed', 400, errors)
    }

    // check if email already exists and throw error if found
    const foundTeamMember = await prisma.teamMember.findUnique({ where: { email: createdTeamMemberInput.email } })
    if(foundTeamMember) {
        throw new ApiError(`TeamMember with email: ${createdTeamMemberInput.email} already exists`, 409)
    }
    // check if team exists and throw error if not
    const foundTeam = await prisma.team.findUnique({ where: { id: createdTeamMemberInput.teamId } })
    if(!foundTeam) {
        throw new ApiError(`Team with Id ${createdTeamMemberInput.teamId} Not Found`, 404)
    }

    // Add to database using prisma
    const createdTeamMember = await prisma.teamMember.create({ data: createdTeamMemberInput })

    // return created team
    res.json(createdTeamMember)
}

export default asyncHandler(createMemberEndpointHandler)
