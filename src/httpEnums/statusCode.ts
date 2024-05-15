// status codes

export default class StatusCode {
    static OK = 200;  // 成功
    static CREATED = 201; // 创建成功
    static ACCEPTED = 202; // 创建成功
    static NO_CONTENT = 204; // 删除成功
    static MOVED_PERMANENTLY = 301; // 永久重定向
    static FOUND = 302; // 临时重定向
    static SEE_OTHER = 303; // 跳转
    static NOT_MODIFIED = 304; // 资源未修改
    static TEMPORARY_REDIRECT = 307; // 临时重定向
    static PERMANENT_REDIRECT = 308; // 永久重定向
    static BAD_REQUEST = 400; // 请求错误
    static UNAUTHORIZED = 401; // 未授权
    static FORBIDDEN = 403; // 禁止访问
    static NOT_FOUND = 404; // 资源不存在
    static METHOD_NOT_ALLOWED = 405; // 方法不允许
    static NOT_ACCEPTABLE = 406; // 不接受
    static REQUEST_TIMEOUT = 408; // 请求超时
    static CONFLICT = 409; // 冲突
    static GONE = 410; // 资源不存在
    static LENGTH_REQUIRED = 411; // 长度错误
    static PRECONDITION_FAILED = 412; // 预条件错误
    static PAYLOAD_TOO_LARGE = 413; // 请求实体过大
    static URI_TOO_LONG = 414; // 请求地址过长
    static UNSUPPORTED_MEDIA_TYPE = 415; // 不支持媒体类型
    static RANGE_NOT_SATISFIABLE = 416; // 请求范围不符合要求
    static EXPECTATION_FAILED = 417; // 预期错误
    static MISDIRECTED_REQUEST = 421; // 错误请求
    static UNPROCESSABLE_ENTITY = 422; // 无法处理请求
    static TOO_EARLY = 425; // 错误请求
    static TOO_MANY_REQUESTS = 429; // 请求过多
    static INTERNAL_SERVER_ERROR = 500; // 服务器错误
    static NOT_IMPLEMENTED = 501; // 服务器未实现
    static BAD_GATEWAY = 502; // 网关错误
    static SERVICE_UNAVAILABLE = 503; // 服务器不可用
    static GATEWAY_TIMEOUT = 504; // 网关超时
    static HTTP_VERSION_NOT_SUPPORTED = 505; // HTTP版本不支持
    static VARIANT_ALSO_NEGOTIATES = 506; // 错误请求
    static INSUFFICIENT_STORAGE = 507; // 存储空间不足
    static LOOP_DETECTED = 508; // 循环请求
    static NOT_EXTENDED = 510; // 请求无法继续

    constructor() {
        throw new Error('StatusCode is a static class and cannot be instantiated');
    }
}

export {StatusCode}