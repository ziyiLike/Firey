import Firefly, {router} from "firey/test";
import {useIncludeRouter, useResponse} from "firey/hooks-test";
import StatusCode from "firey/enums-test/statusCode";
import {ContentType} from "firey/enums-test/contentType";
import {IFY} from "firey/types-test";

export const app = new Firefly(__dirname);

app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.router({
    method: 'GET',
    path: '/',
    handler: () => {
        return {text: 1}
    }
})

class Test {

    @router(app, '/<id:number>', 'GET')
    async testApi(request: IFY.Request, id: number) {
        console.log(id)
        return useResponse('<span style="color: red">Hello Firey!</span>', StatusCode.OK, ContentType.TEXT_HTML)
    }
}

app.run(8088, '0.0.0.0', true);