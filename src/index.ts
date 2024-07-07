import fs from 'fs'
import express, { Application, Response } from 'express'

import * as dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'

import generateFakeData from './db/fakeDB/seed'
import registerApiRoutes from './routes'
import errorHandlerMiddleware from './errorHandlerMiddleware'

// setting Environment Variables
dotenv.config()

// generate and write fake data
if(!fs.existsSync('./src/db/fakeDB/db.json')) {
    fs.writeFileSync('./src/db/fakeDB/db.json', JSON.stringify(generateFakeData(), null, 2))
}

// initializing the express app
const app: Application = express()

// using the needed middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// register all api routes
registerApiRoutes(app)

// catch all routes (other than api routes) and return the index file
app.get('*', (_, res: Response) => res.sendFile(path.join(`${__dirname}/public/index.html`)))

// Error handling
app.use(errorHandlerMiddleware)

// start the web server
const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL
app.listen(PORT, () => void console.log(`The Server is running on port ${BASE_URL}:${PORT}`))
