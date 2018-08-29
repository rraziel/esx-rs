import { AbstractHttpMessage } from './AbstractHttpMessage';
import { HttpHeader } from './HttpHeader';
import { Cookie } from './Cookie';

/**
 * HTTP request
 */
class HttpRequest extends AbstractHttpMessage {
    readonly matrixParameters: Map<string, string>;
    readonly queryParameters: Map<string, string>;
    readonly cookies: Array<Cookie>;
    readonly method: string;
    readonly path: string;

    /**
     * Class constructor
     * @param method           Method
     * @param path             Path
     * @param queryParameters  Query parameters
     * @param matrixParameters Matrix parameters
     * @param headers          HTTP headers
     * @param cookies          Cookies
     * @param payload          Payload
     */
    constructor(method: string, path: string, queryParameters: Map<string, string>, matrixParameters: Map<string, string>, headers: Array<HttpHeader>, cookies: Array<Cookie>, payload?: string) {
        super(headers, payload);
        this.method = method;
        this.path = path;
        this.queryParameters = queryParameters;
        this.matrixParameters = matrixParameters;
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
    getCookie(cookieName: string): Cookie|undefined {
        return this.cookies.find(cookie => cookie.getName() === cookieName);
    }

    /**
     * Get a cookie value
     * @param cookieName Cookie name
     * @return Cookie value
     */
    getCookieValue(cookieName: string): string|undefined {
        let cookie: Cookie|undefined = this.getCookie(cookieName);
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
    getQueryParameter(parameterName: string): string|undefined {
        return this.queryParameters && this.queryParameters.get(parameterName);
    }

    /**
     * Get all matrix parameters
     * @return Matrix parameters
     */
    getMatrixParameters(): Map<string, string> {
        return this.matrixParameters;
    }

    /**
     * Get a matrix parameter
     * @param parameterName Parameter name
     * @return Parameter value
     */
    getMatrixParameter(parameterName: string): string|undefined {
        return this.matrixParameters && this.matrixParameters.get(parameterName);
    }

}

export {
    HttpRequest
};
