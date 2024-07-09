import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteMemberEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    // Find team member
    const teamMemberId = req.params.id
    // find team member using prisma and check if it exists and throw error if not
    const foundMember = await prisma.teamMember.findUnique({ where: { id: teamMemberId } })
    if(!foundMember) {
        throw new ApiError(`TeamMember with Id ${teamMemberId} not found`, 404)
    }

    // Delete team
    const deletedTeamMember = await prisma.teamMember.delete({ where: { id: teamMemberId } })

    // return success message
    res.json(`Team with id ${deletedTeamMember.id} deleted successfully`)
}

export default asyncHandler(deleteMemberEndpointHandler)
