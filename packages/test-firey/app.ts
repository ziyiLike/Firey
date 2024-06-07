import Firey, {router} from "firey/test";
import {useIncludeRouter, useHtmlResponse, useTextResponse} from "firey/hooks-test";
import {IFY} from "firey/types-test";

export const app = new Firey(__dirname);

app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.router({
    method: ['GET', 'POST'],
    path: '/',
    handler: (request) => {
        return useTextResponse('123')
    }
})

class Test {

    @router(app, '/<id:number>', 'GET')
    async testApi(request: IFY.Request, id: number) {
        console.log(id)
        return useHtmlResponse('<span style="color: red">Hello Firey!</span>')
    }
}

app.run(8088, '0.0.0.0', true);