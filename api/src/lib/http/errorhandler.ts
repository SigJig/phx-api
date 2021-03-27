
import { Request, Response, NextFunction } from 'express'
import { Status } from './context'
import HTTP from '../constants/http'
import logger from '../../logger'

export class APIError extends Error {
    status?: Status
    message!: string
    
    constructor(message?: string, status?: Status) {
        super(message)

        if (status !== undefined) {
            this.status = status
        }
    }
}

export class BadRequest extends APIError {
    status = HTTP.bad_request
}

export class InvalidLogin extends BadRequest {
    message = 'Login failed: invalid username or password'
}

export class NotFound extends APIError {
    status = HTTP.not_found

    constructor(identifier?: string | number) {
        super(identifier ? identifier!.toString() : '')
        this.message = (
            identifier ?
            `Resource could not be located using identifier ${identifier}.` : 
            `Resource could not be located.`
        )
    }
}

export class Unauthorized extends APIError {
    status = HTTP.unauthorized
}

export class Forbidden extends APIError {
    status = HTTP.forbidden
}

export class InternalError extends APIError {
    status = HTTP.internal_err

    constructor(message?: string, status?: Status) {
        super(message || 'An internal server error occured', status)
    }
}

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const { context } = req

    if (err instanceof APIError) {
        if (err.status) context.status(err.status)
        if (err.message) context.error(err.message)
    }
    else {
        context.status('internal_err').error('An internal server error occured')
        logger.error(err.toString())
    }

    context.resolve()
}