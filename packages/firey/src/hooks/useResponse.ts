import {IFY} from "../types";
import StatusCode from "../httpEnums/statusCode";
import ContentType from '../httpEnums/contentType'

export const useResponse = (data: any, code: number = StatusCode.OK, contentType: string = ContentType.APPLICATION_JSON): IFY.Response => ({
    data,
    code,
    contentType
})

export const useJsonResponse = (data: any, code: number = StatusCode.OK): IFY.Response => {
    return useResponse(data, code, ContentType.APPLICATION_JSON)
}

export const useHtmlResponse = (data: any, code: number = StatusCode.OK): IFY.Response => {
    return useResponse(data, code, ContentType.TEXT_HTML_UTF8)
}

export const useTextResponse = (data: any, code: number = StatusCode.OK): IFY.Response => {
    return useResponse(data, code, ContentType.TEXT_PLAIN_UTF8)
}

export const useFileResponse = (data: any, code: number = StatusCode.OK): IFY.Response => {
    return useResponse(data, code, ContentType.APPLICATION_OCTET_STREAM)
}