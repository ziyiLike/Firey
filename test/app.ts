import Firefly from "../src";
import {useMiddleware} from "../src/hooks/useMiddleware";
import {useResponse} from "../src/hooks/useResponse";
import {useRouter} from "../src/hooks/useRouter";
import {NotFoundError} from "../src/exceptions";

const app = new Firefly();


app.use(useMiddleware({
    before: () => {
    },
    after: (req, res) => console.log(res)
}));

const testGetApi = useRouter({
    method: 'get',
    path: '/',
    handler: (request) => {
        console.log(request.query)
        return useResponse({message: 'hello world'})
    }
})

app.router(testGetApi)

app.createServer(8088, 'localhost', true);