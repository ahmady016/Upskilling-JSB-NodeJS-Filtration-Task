import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { Team } from '../db/types'

type FindOneTeamQuery = {
	id: string
}
export default function findOneEndpointHandler(
	req: Request<FindOneTeamQuery>,
	res: Response<Team>
) {
	const team = db.teams.find((team) => team.id === req.params.id)
	res.json(team)
}
