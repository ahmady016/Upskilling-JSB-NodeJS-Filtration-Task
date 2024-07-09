import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'

export default function deleteMemberEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    const teamMemberId = req.params.id
    // Find team member
    const foundTeamMember = db.teamMembers.find((team) => team.id === teamMemberId)
    // Check if team exists and throw error if not
    if (!foundTeamMember) {
        throw new ApiError(`Team Member with Id ${teamMemberId} not found`, 404)
    }

    // Delete team
    db.teamMembers = db.teamMembers.filter((team) => team.id !== teamMemberId)

    // save to fakeDB
    writeFakeDb(db)

    // return success message
    res.json(`Team with id ${teamMemberId} deleted successfully`)
}
