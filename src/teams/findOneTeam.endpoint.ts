import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'

import db from '../db/fakeDB/db.json'
import { Team } from '../db/types'
import { ApiError } from '../errorHandlerMiddleware'

type FindOneTeamQuery = {
	id: string
}
export default function findOneTeamEndpointHandler(
	req: Request<FindOneTeamQuery>,
	res: Response<Team>
) {
	const teamId = req.params.id
	const foundTeam = db.teams.find((team) => team.id === teamId)
	if(!foundTeam) {
		throw new ApiError(`Team with Id ${teamId} not found`, 404)
	}
	const team = plainToInstance(Team, foundTeam)
	res.json(team)
}
