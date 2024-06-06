import {IFY} from "../types";
import StatusCode from "../httpEnums/statusCode";

export const useResponse = (data: any, code: number = StatusCode.OK, contentType: string = 'application/json'): IFY.Response => {
    return {
        data,
        code,
        contentType,
    }
}