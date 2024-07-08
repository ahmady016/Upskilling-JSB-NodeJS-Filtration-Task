import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'class-validator'

export class ApiError extends Error {
	statusCode?: number
	validationErrors?: ValidationError[]
	endpoint?: string
	constructor(
		message: string,
		statusCode?: number,
		validationErrors?: ValidationError[],
		endpoint?: string
	) {
		super(message)
		this.statusCode = statusCode || 500
		this.endpoint = endpoint || process.env.BASE_URL
		this.validationErrors = validationErrors || []
	}
}
export default function errorHandlerMiddleware(
	error: ApiError,
	req: Request,
	res: Response,
	_: NextFunction
) {
	const statusCode = error.statusCode ? error.statusCode : 500
	const errorName = error.name || 'ApiError'
	const response: ApiError = {
		name: errorName,
		message: error.message,
		statusCode: statusCode,
		validationErrors: error.validationErrors,
		endpoint: req.url,
	}
	console.error(response)
	res.status(statusCode).send(response)
}
