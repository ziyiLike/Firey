export default class OPERATE_TYPE {
    static readonly INIT = 'INIT'
    static readonly ADD = 'ADD'
    static readonly REMOVE = 'REMOVE'
    static readonly ALERT = 'ALERT'
    static readonly RENAME = 'RENAME'
    static readonly TABLENAME = 'TABLENAME'

    constructor() {
        throw new Error('OPERATE_TYPE is a static class and cannot be instantiated');
    }
}