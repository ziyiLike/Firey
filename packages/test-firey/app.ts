import Firey, {router} from "firey/test";
import {useIncludeRouter, useHtmlResponse, useTextResponse, useJsonResponse, useResponse} from "firey/hooks-test";
import {IFY} from "firey/types-test";

export const app = new Firey(__dirname);

app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.router({
    method: ['GET', 'POST'],
    path: '/',
    handler: (request) => {
        return useResponse('test')
    }
})

class Test {

    @router(app, '/<id:number>', 'GET')
    async testApi(_: IFY.Request, id: number) {
        console.log(id)
        return useJsonResponse('123')
    }
}

app.run()