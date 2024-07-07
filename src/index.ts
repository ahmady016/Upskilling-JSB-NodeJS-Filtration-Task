import express, { Application, Response } from 'express'

import * as dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'

import registerApiRoutes from './routes'

// setting Environment Variables
dotenv.config()

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

// start the web server
const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL
app.listen(PORT, () => void console.log(`The Server is running on port ${BASE_URL}:${PORT}`))
