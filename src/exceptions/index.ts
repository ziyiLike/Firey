// Exceptions
import StatusCode from '../status'

export class BaseError extends Error {
    name: string = 'BaseError'
    code: number | undefined

    constructor(message?: string, code?: number) {
        super(message);
        this.message = message || this.name || 'unknown'
        code && (this.code = code)
    }
}

export class FireflyError extends BaseError {
    name = 'FireflyError'
}

export class RequestError extends BaseError {
    name = 'RequestError'
    code = StatusCode.INTERNAL_SERVER_ERROR
}

export class ResponseError extends BaseError {
    name = 'ResponseError'
    code = StatusCode.INTERNAL_SERVER_ERROR
}

export class NotFoundError extends BaseError {
    name = 'NotFoundError'
    code = StatusCode.NOT_FOUND
}

export class MethodNotAllowedError extends BaseError {
    name = 'MethodNotAllowedError'
    code = StatusCode.METHOD_NOT_ALLOWED
}

export class InternalServerError extends BaseError {
    name = 'InternalServerError'
    code = StatusCode.INTERNAL_SERVER_ERROR
}

export class BadRequestError extends BaseError {
    name = 'BadRequestError';
    code = StatusCode.BAD_REQUEST;
}

export class UnauthorizedError extends BaseError {
    name = 'UnauthorizedError';
    code = StatusCode.UNAUTHORIZED;
}

export class ForbiddenError extends BaseError {
    name = 'ForbiddenError';
    code = StatusCode.FORBIDDEN;
}


export class PermissionDeniedError extends BaseError {
    name = 'PermissionDeniedError';
    code = StatusCode.FORBIDDEN;
}

