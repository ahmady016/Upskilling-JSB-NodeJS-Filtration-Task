import { Request, Response, NextFunction } from 'express'

export class ApiError extends Error {
	statusCode?: number
	endpoint?: string
	constructor(message: string, statusCode?: number, endpoint?: string) {
		super(message)
		this.statusCode = statusCode || 500
		this.endpoint = endpoint || process.env.BASE_URL
	}
}
export default function errorHandlerMiddleware(
	error: ApiError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (error) {
		const statusCode = error.statusCode ? error.statusCode : 500
		const response: ApiError = {
			name: 'ApiError',
			statusCode: statusCode,
			endpoint: req.url,
			message: error.message,
		}
		console.error(response)
		res.status(statusCode).send(response)
	}
	next()
}
