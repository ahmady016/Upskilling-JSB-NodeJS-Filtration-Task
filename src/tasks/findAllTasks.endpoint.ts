import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { Task } from '../db/types'

export default function findAllTasksEndpointHandler(
	_: Request,
	res: Response<Task[]>
) {
	res.json(db.tasks as Task[])
}
