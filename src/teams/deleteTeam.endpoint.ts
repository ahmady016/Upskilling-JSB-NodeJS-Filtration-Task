import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'

export default function deleteTeamEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    const teamId = req.params.id
    // Find team
    const foundTeam = db.teams.find((team) => team.id === teamId)
    // Check if team exists and throw error if not
    if (!foundTeam) {
        throw new ApiError(`Team with Id ${teamId} not found`, 404)
    }

    // Delete team
    db.teams = db.teams.filter((team) => team.id !== teamId)

    // save to fakeDB
    writeFakeDb(db)

    // return success message
    res.json(`Team with id ${teamId} deleted successfully`)
}
