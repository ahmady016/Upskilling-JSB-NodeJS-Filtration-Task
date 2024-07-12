import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { TeamMember } from '@prisma/client'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'
import { CreateOrUpdateTeamMemberInput } from './createMember.endpoint'
import prisma from '../prisma'

async function updateMemberEndpointHandler(
    req: Request<{ id: string }, unknown, CreateOrUpdateTeamMemberInput>,
    res: Response<TeamMember>
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
    // find team member using prisma and check if it exists and throw error if not
    const foundMember = await prisma.teamMember.findUnique({ where: { id: teamMemberId } })
    if(!foundMember) {
        throw new ApiError(`TeamMember with Id ${teamMemberId} not found`, 404)
    }

    // Update team member using prisma
    const updatedTeamMember = await prisma.teamMember.update({
        where: { id: teamMemberId },
        data: updatedTeamMemberInput
    })

    // return updated team member
    res.json(updatedTeamMember)
}

export default asyncHandler(updateMemberEndpointHandler)
