import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'

import db from '../db/fakeDB/db.json'
import { Task } from '../db/types'
import { ApiError } from '../errorHandlerMiddleware'

type FindOneTaskQuery = {
	id: string
}
export default function findOneTaskEndpointHandler(
	req: Request<FindOneTaskQuery>,
	res: Response<Task>
) {
	const taskId = req.params.id
	const foundTask = db.tasks.find((task) => task.id === taskId)
	if(!foundTask) {
		throw new ApiError(`Task with Id ${taskId} not found`, 404)
	}
	const task = plainToInstance(Task, foundTask)
	res.json(task)
}
