import {IFY} from "../types";

export const useResponse = (data: any, code: number = 200, contentType: string = 'application/json'): IFY.Response => {
    return {
        data,
        code,
        contentType,
    }
}