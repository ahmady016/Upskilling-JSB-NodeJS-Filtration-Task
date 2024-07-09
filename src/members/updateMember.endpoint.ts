import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import db from '../db/fakeDB/db.json'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'
import { CreateOrUpdateTeamMemberInput } from './createMember.endpoint'

async function updateMemberEndpointHandler(
    req: Request<{ id: string }, unknown, CreateOrUpdateTeamMemberInput>,
    res: Response
) {
    // transform input to class and validate
    const updatedTeamMemberInput = plainToInstance(CreateOrUpdateTeamMemberInput, req.body)
    const errors = await validate(updatedTeamMemberInput)
    // check for validation errors and throw error if found
    if(errors.length > 0) {
        throw new ApiError('Validation Failed', 400, errors)
    }

    // Find team member
    const teamMemberId = req.params.id
    const foundTeamMember = db.teamMembers.find((teamMember) => teamMember.id === teamMemberId)
    // Check if team exists and throw error if not
    if(!foundTeamMember) {
        throw new ApiError(`TeamMember with Id ${teamMemberId} not found`, 404)
    }

    // Update team member
    foundTeamMember.id = teamMemberId
    foundTeamMember.name = updatedTeamMemberInput.name
    foundTeamMember.email = updatedTeamMemberInput.email
    foundTeamMember.birthDate = updatedTeamMemberInput.birthDate
    foundTeamMember.gender = updatedTeamMemberInput.gender
    foundTeamMember.teamId = updatedTeamMemberInput.teamId
    foundTeamMember.updatedAt = new Date().toISOString()

    // save to fakeDB
    writeFakeDb(db)

    // return updated team member
    res.json(foundTeamMember)
}

export default asyncHandler(updateMemberEndpointHandler)
