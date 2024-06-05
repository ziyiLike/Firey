import Firefly from "../firey";
import {useIncludeRouter} from "firey/hooks";

const app = new Firefly();


app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.run(8088, '0.0.0.0', true);