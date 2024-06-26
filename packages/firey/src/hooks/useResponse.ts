import {IFY} from "../types";
import STATUS_CODE from "../httpEnums/STATUS_CODE";
import CONTENT_TYPE from '../httpEnums/CONTENT_TYPE'

export const useResponse = (data: any, code: number = STATUS_CODE.OK, contentType: string = CONTENT_TYPE.APPLICATION_JSON): IFY.Response => ({
    data,
    code,
    contentType
})

export const useJsonResponse = (data: any, code: number = STATUS_CODE.OK): IFY.Response => {
    return useResponse(data, code, CONTENT_TYPE.APPLICATION_JSON)
}

export const useHtmlResponse = (data: any, code: number = STATUS_CODE.OK): IFY.Response => {
    return useResponse(data, code, CONTENT_TYPE.TEXT_HTML_UTF8)
}

export const useTextResponse = (data: any, code: number = STATUS_CODE.OK): IFY.Response => {
    return useResponse(data, code, CONTENT_TYPE.TEXT_PLAIN_UTF8)
}

export const useFileResponse = (data: any, code: number = STATUS_CODE.OK): IFY.Response => {
    return useResponse(data, code, CONTENT_TYPE.APPLICATION_OCTET_STREAM)
}