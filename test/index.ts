import Firefly from "../src";
import {useMiddleware} from "../src/hooks/useMiddleware";

const app = new Firefly();


app.use(useMiddleware({
    before: () => console.log('before'),
    after: () => console.log('after')
}));


// test route
app.route('GET', '/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Hello World!');
});

app.createServer(8088);