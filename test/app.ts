import Firefly from "../src";
import {useIncludeRouter} from "../src/hooks/useIncludeRouter";
import {useMiddleware} from "../src/hooks/useMiddleware";
import {useResponse} from "../src/hooks/useResponse";

const app = new Firefly({
    rootPath: __dirname
});

// app.use(useMiddleware({
//     before: () => {
//         console.log(1)
//         return useResponse({message: '1'})
//     },
//     after: (req, res) => {
//         console.log(res)
//         return useResponse({message: 'test'})
//     }
// }))
//
//
// app.use(useMiddleware({
//     before: () => {
//         console.log(2)
//         return useResponse({message: '1'})
//     },
//     after: (req, res) => {
//         console.log(res)
//         return useResponse({message: 'test2'})
//     }
// }))

app.router([
    useIncludeRouter('/test-api', 'apps.test'),
])

app.run(8088, '0.0.0.0', true);