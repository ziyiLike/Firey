export default class ContentType {
    static readonly APPLICATION_JSON = 'application/json';
    static readonly APPLICATION_FORM_URLENCODED = 'application/x-www-form-urlencoded';
    static readonly APPLICATION_OCTET_STREAM = 'application/octet-stream';
    static readonly FORM_DATA = 'multipart/form-data';
    static readonly TEXT_PLAIN = 'text/plain';
    static readonly TEXT_HTML = 'text/html';
    static readonly TEXT_CSS = 'text/css';
    static readonly TEXT_XML = 'text/xml';
    static readonly TEXT_JAVASCRIPT = 'text/javascript';
    static readonly TEXT_EVENT_STREAM = 'text/event-stream';
    static readonly TEXT_MARKDOWN = 'text/markdown';
    static readonly TEXT_CALENDAR = 'text/calendar';
    static readonly TEXT_VCARD = 'text/vcard';
    static readonly TEXT_RICHTEXT = 'text/richtext';
    static readonly TEXT_PLAIN_UTF8 = 'text/plain; charset=utf-8';
    static readonly TEXT_HTML_UTF8 = 'text/html; charset=utf-8';
    static readonly TEXT_CSS_UTF8 = 'text/css; charset=utf-8';
    static readonly TEXT_XML_UTF8 = 'text/xml; charset=utf-8';
    static readonly TEXT_JAVASCRIPT_UTF8 = 'text/javascript; charset=utf-8';
    static readonly TEXT_EVENT_STREAM_UTF8 = 'text/event-stream; charset=utf-8';
    static readonly TEXT_MARKDOWN_UTF8 = 'text/markdown; charset=utf-8';
    static readonly TEXT_CALENDAR_UTF8 = 'text/calendar; charset=utf-8';
    static readonly TEXT_VCARD_UTF8 = 'text/vcard; charset=utf-8';
    static readonly TEXT_RICHTEXT_UTF8 = 'text/richtext; charset=utf-8';
    static readonly IMAGE_JPEG = 'image/jpeg';
    static readonly IMAGE_PNG = 'image/png';
    static readonly IMAGE_GIF = 'image/gif';
    static readonly IMAGE_BMP = 'image/bmp';
    static readonly IMAGE_SVG = 'image/svg+xml';
    static readonly IMAGE_TIFF = 'image/tiff';
    static readonly IMAGE_WEBP = 'image/webp';
    static readonly IMAGE_ICO = 'image/x-icon';
    static readonly IMAGE_ICO_UTF8 = 'image/x-icon; charset=utf-8';

    constructor() {
        throw new Error('ContentType is a static class and cannot be instantiated');
    }
}