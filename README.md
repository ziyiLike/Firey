# Firefly

A cross-era framework for Node Js Web services

## Installation

```bash
pnpm install firey --save
```

## Quick Start

Within the context of Firefly, the prescribed routing conventions entail that by declaring the app directory path in the
entry file, Firefly will proactively seek out the router.ts file situated within this specified directory and
subsequently integrate it into the routing framework automatically.

- app.ts

```ts
import Firefly from "firey";
import {useIncludeRouter} from "firey/hooks";


const app = new Firefly(__dirname);

app.router([useIncludeRouter('/test-api', 'apps.test')]);

app.run(8088, '0.0.0.0', true);
```

- apps/test/router.ts

```ts
import {useRouter} from "firey/hooks";
import * as api from './api'

export default useRouter([
    {method: 'GET', path: '/test', handler: api.testApi}
])
```

- apps/test/api.ts

```ts
import {useResponse} from "firey/hooks";
import {IFY} from "firey/types";

export const testApi = async (request: IFY.Request) => {
    return useResponse({message: 'hello firey!'});
};
```
