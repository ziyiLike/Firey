import {IFY} from "../../../src/types";
import {NotFoundError} from "../../../src/exceptions";
import {useResponse} from "../../../src/hooks/useResponse";


export const testApi = (request: IFY.Request) => {
    console.log(request.query)
    throw new NotFoundError()
}

export const testApi2 = (request: IFY.Request) => {
    console.log(request.query)
    return useResponse({message: 'test2'})
}