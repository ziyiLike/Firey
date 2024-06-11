# Firey

A cross-era framework for Node Js Web services

## Docs

- [中文文档](http://ziyilike.com:10200)

## Installation

#### Bun

```bash
win:
powershell -c "irm bun.sh/install.ps1 | iex"

linux:
curl -fsSL https://bun.sh/install | bash

node:
npm install -g bun
```

#### Firey

```bash
bun add firey --save
```

## Quick Start

Within the context of Firey, the prescribed routing conventions entail that by declaring the app directory path in the
entry file, Firey will proactively seek out the router.ts file situated within this specified directory and
subsequently integrate it into the routing framework automatically.

- app.ts

```ts
import Firey from "firey";
import {useIncludeRouter} from "firey/hooks";


const app = new Firey(__dirname);

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
