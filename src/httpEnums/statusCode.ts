// status codes

export default class StatusCode {
    static OK = 200;
    static CREATED = 201;
    static ACCEPTED = 202;
    static NO_CONTENT = 204;
    static MOVED_PERMANENTLY = 301;
    static FOUND = 302;
    static SEE_OTHER = 303;
    static NOT_MODIFIED = 304;
    static TEMPORARY_REDIRECT = 307;
    static PERMANENT_REDIRECT = 308;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static METHOD_NOT_ALLOWED = 405;
    static NOT_ACCEPTABLE = 406;
    static REQUEST_TIMEOUT = 408;
    static CONFLICT = 409;
    static GONE = 410;
    static LENGTH_REQUIRED = 411;
    static PRECONDITION_FAILED = 412;
    static PAYLOAD_TOO_LARGE = 413;
    static URI_TOO_LONG = 414;
    static UNSUPPORTED_MEDIA_TYPE = 415;
    static RANGE_NOT_SATISFIABLE = 416;
    static EXPECTATION_FAILED = 417;
    static IM_A_TEAPOT = 418;
    static MISDIRECTED_REQUEST = 421;
    static UNPROCESSABLE_ENTITY = 422;
    static TOO_EARLY = 425;
    static TOO_MANY_REQUESTS = 429;
    static INTERNAL_SERVER_ERROR = 500;
    static NOT_IMPLEMENTED = 501;
    static BAD_GATEWAY = 502;
    static SERVICE_UNAVAILABLE = 503;
    static GATEWAY_TIMEOUT = 504;
    static HTTP_VERSION_NOT_SUPPORTED = 505;
    static VARIANT_ALSO_NEGOTIATES = 506;
    static INSUFFICIENT_STORAGE = 507;
    static LOOP_DETECTED = 508;
    static NOT_EXTENDED = 510;

    constructor() {
        throw new Error('StatusCode is a static class and cannot be instantiated');
    }
}

export {StatusCode}