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
    queryParameters?: Map<string, string>;
    body?: string;

    /**
     * Class constructor
     * @param method Method
     * @param path   Path
     */
    constructor(method: string, path: string) {
        this.method = method;
        this.path = path;
    }

    /**
     * Get an HTTP header
     * @param headerName Header name
     * @return HTTP header
     */
    getHeader(headerName: string): HttpHeader {
        if (this.headers) {
            let index: number = this.headers.findIndex(httpHeader => httpHeader.name === headerName);
            if (index !== -1) {
                return this.headers[index];
            }
        }

        return undefined;
    }

    /**
     * Get an HTTP header value
     * @param headerName Header name
     * @return Header value
     */
    getHeaderValue(headerName: string): string {
        let httpHeader = this.getHeader(headerName);
        return httpHeader && httpHeader.value;
    }

    /**
     * Get a cookie
     * @param cookieName Cookie name
     * @return Cookie
     */
    getCookie(cookieName: string): HttpCookie {
        if (this.cookies) {
            let index: number = this.cookies.findIndex(httpCookie => httpCookie.name === cookieName);
            if (index !== -1) {
                return this.cookies[index];
            }
        }

        return undefined;
    }

    /**
     * Get a cookie value
     * @param cookieName Cookie name
     * @return Cookie value
     */
    getCookieValue(cookieName: string): string {
        let httpCookie = this.getCookie(cookieName);
        return httpCookie && httpCookie.value;
    }

    /**
     * Get a query parameter
     * @param parameterName Parameter name
     * @return Parameter value
     */
    getQueryParameter(parameterName: string): string {
        if (this.queryParameters) {
            return this.queryParameters.get(parameterName);
        }

        return undefined;
    }

}

export {
    HttpRequest
};
