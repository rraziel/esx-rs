import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';

/**
 * HTTP context
 */
class HttpContext {
    httpRequest: HttpRequest;
    httpResponse: HttpResponse;
}

export {
    HttpContext
};
