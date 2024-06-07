import {useRuntimeEnv} from "../hooks"

export class Effects {

    get(path: string, query?: Record<string, any>): Promise<any> {
        if (query) {
            return this.get(path + '?' + new URLSearchParams(query).toString())
        }
        return fetch(new Request(`http://localhost:${useRuntimeEnv('FIREY_PORT')}` + path, {method: "GET"}))
    }
}