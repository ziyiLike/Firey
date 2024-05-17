import Firefly from "../src";
import {useMiddleware} from "../src/hooks/useMiddleware";
import {useIncludeRouter} from "../src/hooks/useIncludeRouter";
import {useResponse} from "../src/hooks/useResponse";

const app = new Firefly({
    rootPath: __dirname
});


app.use(useMiddleware({
    before: (req) => {
        return useResponse({message: 123})
    },
    after: (req, res) => {
    }
}));


app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.createServer(8088, '0.0.0.0', true);