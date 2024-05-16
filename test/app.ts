import Firefly from "../src";
import {useMiddleware} from "../src/hooks/useMiddleware";
import {useIncludeRouter} from "../src/hooks/useIncludeRouter";

const app = new Firefly({
    rootPath: __dirname
});


app.use(useMiddleware({
    before: () => {
    },
    after: (req, res) => {
    }
}));


app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.createServer(8088, 'localhost', true);