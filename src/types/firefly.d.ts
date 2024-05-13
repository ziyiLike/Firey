declare module "FY" {
    import http from "http";

    class IMainInterface {

        private routes: {
            [method: string]: { [path: string]: (req: http.IncomingMessage, res: http.ServerResponse) => void }
        };
        private middlewares: Array<(req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void>;

        use(middleware: (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void): void;

        route(method: string, path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void): void;

        createServer(port: number, hostname: string): void;

        private requestListener(req: http.IncomingMessage, res: http.ServerResponse): void;
    }
}
