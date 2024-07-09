import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { TeamMember } from '../db/types'

export default function findAllMembersEndpointHandler(
    _: Request,
    res: Response<TeamMember[]>
) {
    res.json(db.teamMembers as TeamMember[])
}
