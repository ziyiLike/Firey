import Firefly from "../src";
import {useIncludeRouter} from "../src/hooks/useIncludeRouter";

const app = new Firefly({
    rootPath: __dirname
});


app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.run(8088, '0.0.0.0', true);