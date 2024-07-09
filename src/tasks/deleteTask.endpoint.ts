import { Request, Response } from 'express'

import db from '../db/fakeDB/db.json'
import { writeFakeDb } from '../db/fakeDB/seed'
import { ApiError } from '../errorHandlerMiddleware'

export default function deleteMemberEndpointHandler(
    req: Request<{ id: string }>,
    res: Response<string>
) {
    const taskId = req.params.id
    // Find task member
    const foundTask = db.tasks.find((task) => task.id === taskId)
    // Check if task exists and throw error if not
    if (!foundTask) {
        throw new ApiError(`Team Member with Id ${taskId} not found`, 404)
    }

    // Delete task
    db.tasks = db.tasks.filter((task) => task.id !== taskId)

    // save to fakeDB
    writeFakeDb(db)

    // return success message
    res.json(`Team with id ${taskId} deleted successfully`)
}
