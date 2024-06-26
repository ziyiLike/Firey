// Exceptions
import STATUS_CODE from '../httpEnums/STATUS_CODE'
import {IFY} from '../types'

export class BaseError extends Error {
    state: IFY.ErrorState = {}
    name: string = 'BaseError'
    code: number | undefined

    constructor(message?: string, code?: number, state?: IFY.ErrorState) {
        super(message);
        code && (this.code = code)
        state && (this.state = state)
    }
}

export class FireyError extends BaseError {
    name = 'FireyError'
}

export class RequestError extends BaseError {
    name = 'RequestError'
    code = STATUS_CODE.INTERNAL_SERVER_ERROR
}

export class ResponseError extends BaseError {
    name = 'ResponseError'
    code = STATUS_CODE.INTERNAL_SERVER_ERROR
}

export class NotFoundError extends BaseError {
    name = 'NotFoundError'
    code = STATUS_CODE.NOT_FOUND
}

export class MethodNotAllowedError extends BaseError {
    name = 'MethodNotAllowedError'
    code = STATUS_CODE.METHOD_NOT_ALLOWED
}

export class InternalServerError extends BaseError {
    name = 'InternalServerError'
    code = STATUS_CODE.INTERNAL_SERVER_ERROR
}

export class BadRequestError extends BaseError {
    name = 'BadRequestError';
    code = STATUS_CODE.BAD_REQUEST;
}

export class UnauthorizedError extends BaseError {
    name = 'UnauthorizedError';
    code = STATUS_CODE.UNAUTHORIZED;
}

export class ForbiddenError extends BaseError {
    name = 'ForbiddenError';
    code = STATUS_CODE.FORBIDDEN;
}


export class PermissionDeniedError extends BaseError {
    name = 'PermissionDeniedError';
    code = STATUS_CODE.FORBIDDEN;
}

export class ParseBodyError extends BaseError {
    name = 'ParseBodyError';
    code = STATUS_CODE.UNPROCESSABLE_ENTITY;
}