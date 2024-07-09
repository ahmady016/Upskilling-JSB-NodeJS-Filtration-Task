import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { PrismaClient, TeamMember } from '@prisma/client'
const prisma = new PrismaClient()

async function findAllMembersEndpointHandler(
    _: Request,
    res: Response<TeamMember[]>
) {
    const teamMembers = await prisma.teamMember.findMany()
    res.json(teamMembers)
}

export default asyncHandler(findAllMembersEndpointHandler)
