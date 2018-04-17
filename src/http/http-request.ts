import {AbstractHttpMessage} from './abstract-http-message';
import {HttpHeader} from './http-header';
import {Cookie} from './cookie';

/**
 * HTTP request
 */
class HttpRequest extends AbstractHttpMessage {
    queryParameters?: Map<string, string>;
    cookies?: Array<Cookie>;
    method: string;
    path: string;

    /**
     * Class constructor
     * @param method          Method
     * @param path            Path
     * @param queryParameters Query parameters
     * @param headers         HTTP headers
     * @param cookies         Cookies
     * @param payload         Payload
     */
    constructor(method: string, path: string, queryParameters?: Map<string, string>, headers?: Array<HttpHeader>, cookies?: Array<Cookie>, payload?: string) {
        super(headers, payload);
        this.method = method;
        this.path = path;
        this.queryParameters = queryParameters;
        this.cookies = cookies;
    }

    /**
     * Get the method
     * @return Method
     */
    getMethod(): string {
        return this.method;
    }

    /**
     * Get the path
     * @return Path
     */
    getPath(): string {
        return this.path;
    }

    /**
     * Get all cookies
     * @return Cookies
     */
    getCookies(): Array<Cookie> {
        return this.cookies;
    }

    /**
     * Get a cookie
     * @param cookieName Cookie name
     * @return Cookie
     */
    getCookie(cookieName: string): Cookie {
        return this.cookies && this.cookies.find(cookie => cookie.getName() === cookieName);
    }

    /**
     * Get a cookie value
     * @param cookieName Cookie name
     * @return Cookie value
     */
    getCookieValue(cookieName: string): string {
        let cookie: Cookie = this.getCookie(cookieName);
        return cookie && cookie.getValue();
    }

    /**
     * Get all query parameters
     * @return Query parameters
     */
    getQueryParameters(): Map<string, string> {
        return this.queryParameters;
    }

    /**
     * Get a query parameter
     * @param parameterName Parameter name
     * @return Parameter value
     */
    getQueryParameter(parameterName: string): string {
        return this.queryParameters && this.queryParameters.get(parameterName);
    }

}

export {
    HttpRequest
};
