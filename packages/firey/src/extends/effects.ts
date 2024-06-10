import {useRuntimeEnv} from "../hooks"

export class Effects {

    get(path: string, query?: Record<string, any>): Promise<Response> {
        if (query) {
            return this.get(path + '?' + new URLSearchParams(query).toString())
        }
        return fetch(new Request(`http://localhost:${useRuntimeEnv('FIREY_PORT')}` + path, {method: "GET"}))
    }

    hadnleRequest(method: string, path: string, body?: Record<string, any>): Promise<Response> {
        return fetch(new Request(`http://localhost:${useRuntimeEnv('FIREY_PORT')}` + path, {
            method,
            body: JSON.stringify(body)
        }))
    }

    post(path: string, body?: Record<string, any>): Promise<Response> {
        return this.hadnleRequest("POST", path, body)
    }

    put(path: string, body?: Record<string, any>): Promise<Response> {
        return this.hadnleRequest("PUT", path, body)
    }

    delete(path: string, body?: Record<string, any>): Promise<Response> {
        return this.hadnleRequest("DELETE", path, body)
    }

    patch(path: string, body?: Record<string, any>): Promise<Response> {
        return this.hadnleRequest("PATCH", path, body)
    }
}