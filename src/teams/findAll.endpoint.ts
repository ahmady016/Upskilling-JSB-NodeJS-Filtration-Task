import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { Team } from '../db/types'

export default function findAllEndpointHandler(
	_: Request,
	res: Response<Team[]>
) {
	res.json(db.teams)
}
