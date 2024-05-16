import {useRouter} from "../../../src/hooks/useRouter";
import * as api from './api'

export default [
    useRouter('GET', '/test', api.testApi),
    useRouter('GET', '/test2', api.testApi2),
]