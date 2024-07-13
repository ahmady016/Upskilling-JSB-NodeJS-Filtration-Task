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
type ApiErrorResponse = {
	name: string
	message: string
	statusCode: number
	validationErrors: Record<string, string[]>
	endpoint: string
}
function mapValidationErrors(errors: ValidationError[]): Record<string, string[]> {
	return errors.reduce((acc, error) => {
		acc[error.property] = Object.values(error.constraints)
		return acc
	}, {} as Record<string, string[]>)
}
export default function errorHandlerMiddleware(
	error: ApiError,
	req: Request,
	res: Response,
	_: NextFunction
) {
	const statusCode = error.statusCode ? error.statusCode : 500
	const errorName = error.name || 'ApiError'
	const response: ApiErrorResponse = {
		name: errorName,
		message: error.message,
		statusCode: statusCode,
		validationErrors: error.validationErrors.length > 0 ? mapValidationErrors(error.validationErrors) : null,
		endpoint: req.url,
	}
	console.error(response)
	res.status(statusCode).send(response)
}
