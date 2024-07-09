import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { IsNotEmpty, Length, IsEmail, IsDateString, IsEnum, IsUUID, validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { TeamMember, Gender } from '../db/types'
import { ApiError } from '../errorHandlerMiddleware'

import db from '../db/fakeDB/db.json'
import { writeFakeDb } from '../db/fakeDB/seed'
import Chance from 'chance'
const ch = new Chance()

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

    // transform createdTeamInput to Team and Add to database
    const createdTeamMember = plainToInstance(TeamMember, {
        id: ch.guid(),
        ...createdTeamMemberInput,
        gender: Gender[createdTeamMemberInput.gender as keyof typeof Gender],
        createdAt: new Date().toISOString(),
        updatedAt: '',
    })
    db.teamMembers.push(createdTeamMember)

    // save to fakeDB
    writeFakeDb(db)

    // return created team
    res.json(createdTeamMember)
}

export default asyncHandler(createMemberEndpointHandler)
