import {useRouter} from "firey/hooks";
import * as api from './api'

export default useRouter([
    {method: 'GET', path: '/test', handler: api.testApi},
    {method: 'GET', path: '/test2', handler: api.testApi2},
    {method: 'POST', path: '/test', handler: api.testPostApi},
    {method: 'GET', path: '/test/<name:string:?>/user', handler: api.testRegexApi},
    {method: 'GET', path: '/test/<name:string|number>/<age:number>/user', handler: api.testRegexApi2},
])