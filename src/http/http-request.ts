import {HttpCookie} from './http-cookie';
import {HttpHeader} from './http-header';

/**
 * HTTP request
 */
class HttpRequest {
    method: string;
    path: string;
    cookies?: Array<HttpCookie>;
    headers?: Array<HttpHeader>;
    queryParameters?: Map<String, String>;
    content?: string;
}

export {
    HttpRequest
};
