

# Firey

Un framework multiplataforma para servicios web de Node.js

## Documentación

- [中文文档](https://firey.ziyilike.com/)

## Instalación

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

## Inicio Rápido

En el contexto de Firey, las convenciones de enrutamiento establecidas implican que, al declarar la ruta del directorio de la aplicación en el archivo de entrada, Firey buscará de manera proactiva el archivo `router.ts` ubicado dentro de dicho directorio especificado y, posteriormente, lo integrará automáticamente en el framework de enrutamiento.

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
