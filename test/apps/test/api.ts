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


export const testPostApi = (request: IFY.Request) => {
    console.log(request.data)
    console.log(request.data.file2.size)
    console.log(request.data.file2.toBuffer())
    request.data.file2.save('./test.xlsx')
    return useResponse({message: 'test3'})
}

export const testRegexApi = (request: IFY.Request, name: string) => {
    console.log(name)
    return useResponse({message: 'test4'})
}

export const testRegexApi2 = async (request: IFY.Request, name: string, age: number) => {
    console.log(name, age)
    await sleep(3000)
    return useResponse({message: 'test4'})
}


function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
}