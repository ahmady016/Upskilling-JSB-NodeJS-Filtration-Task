import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'
import prisma from '../prisma'

async function deleteTeamEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    const teamId = req.params.id
    // Find team
    const foundTeam = await prisma.team.findUnique({ where: { id: teamId } })
    // Check if team exists and throw error if not
    if (!foundTeam) {
        throw new ApiError(`Team with Id ${teamId} not found`, 404)
    }

    // Delete team
    const deletedTeam = await prisma.team.delete({ where: { id: teamId } })

    // return success message
    res.json(`Team with id ${deletedTeam.id} deleted successfully`)
}

export default asyncHandler(deleteTeamEndpointHandler)
