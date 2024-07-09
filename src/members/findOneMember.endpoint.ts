import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'

import db from '../db/fakeDB/db.json'
import { TeamMember } from '../db/types'
import { ApiError } from '../errorHandlerMiddleware'

type FindOneMemberQuery = {
	id: string
}
export default function findOneMemberEndpointHandler(
    req: Request<FindOneMemberQuery>,
    res: Response<TeamMember>
) {
    const memberId = req.params.id
    const foundMember = db.teamMembers.find((member) => member.id === memberId)
    if(!foundMember) {
        throw new ApiError(`TeamMember with Id ${memberId} not found`, 404)
    }
    const teamMember = plainToInstance(TeamMember, foundMember)
	res.json(teamMember)
}
