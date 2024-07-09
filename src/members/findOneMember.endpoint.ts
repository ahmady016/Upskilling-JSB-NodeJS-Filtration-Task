import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { ApiError } from '../errorHandlerMiddleware'

import { PrismaClient, TeamMember } from '@prisma/client'
const prisma = new PrismaClient()

type FindOneMemberQuery = {
	id: string
}
async function findOneMemberEndpointHandler(
    req: Request<FindOneMemberQuery>,
    res: Response<TeamMember>
) {
    const memberId = req.params.id
    const foundMember = await prisma.teamMember.findUnique({ where: { id: memberId } })
    if(!foundMember) {
        throw new ApiError(`TeamMember with Id ${memberId} not found`, 404)
    }
	res.json(foundMember)
}

export default asyncHandler(findOneMemberEndpointHandler)
