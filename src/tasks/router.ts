import { Router } from 'express'

import findAllTasksEndpointHandler from './findAllTasks.endpoint'
import findOneTaskEndpointHandler from './findOneTask.endpoint'
import createTaskEndpointHandler from './createTask.endpoint'
import updateTaskEndpointHandler from './updateTask.endpoint'
import deleteTaskEndpointHandler from './deleteTask.endpoint'

const tasksRouter = Router()

tasksRouter.get('/list', findAllTasksEndpointHandler)
tasksRouter.get('/:id', findOneTaskEndpointHandler)
tasksRouter.post('/create', createTaskEndpointHandler)
tasksRouter.put('/:id', updateTaskEndpointHandler)
tasksRouter.delete('/:id', deleteTaskEndpointHandler)

export default tasksRouter
