import {useRouter} from "../../../src/hooks/useRouter";
import * as api from './api'

export default useRouter([
    {method: 'GET', path: '/test', handler: api.testApi},
    {method: 'GET', path: '/test2', handler: api.testApi2},
    {method: 'POST', path: '/test', handler: api.testPostApi},
])