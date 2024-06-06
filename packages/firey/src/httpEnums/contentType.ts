export class ContentType {
    static readonly APPLICATION_JSON = 'application/json';
    static readonly APPLICATION_FORM_URLENCODED = 'application/x-www-form-urlencoded';
    static readonly APPLICATION_OCTET_STREAM = 'application/octet-stream';
    static readonly FORM_DATA = 'multipart/form-data';
    static readonly TEXT_PLAIN = 'text/plain';
    static readonly TEXT_HTML = 'text/html';
    static readonly TEXT_CSS = 'text/css';
    static readonly TEXT_XML = 'text/xml';

    constructor() {
        throw new Error('ContentType is a static class and cannot be instantiated');
    }
}