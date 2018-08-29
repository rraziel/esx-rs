import { AbstractHttpMessageBuilder } from './AbstractHttpMessageBuilder';
import { Cookie } from './Cookie';
import { HttpRequest } from './HttpRequest';

/**
 * HTTP request builder
 */
class HttpRequestBuilder extends AbstractHttpMessageBuilder<HttpRequest> {
    private readonly matrixParameters: Map<string, string> = new Map<string, string>();
    private readonly queryParameters: Map<string, string> = new Map<string, string>();
    private readonly cookies: Array<Cookie> = new Array<Cookie>();
    private readonly method: string;
    private readonly path: string;

    /**
     * Class constructor
     * @param method Method
     * @param path   Path
     */
    private constructor(method: string, path: string) {
        super();
        this.method = method;
        this.path = path;
    }

    /**
     * Add a query parameter
     * @param parameterName  Parameter name
     * @param parameterValue Parameter value
     * @return this
     */
    withQuery(parameterName: string, parameterValue: string): HttpRequestBuilder {
        this.queryParameters.set(parameterName, parameterValue);
        return this;
    }

    /**
     * Add a matrix parameter
     * @param parameterName  Parameter name
     * @param parameterValue Parameter value
     */
    withMatrix(parameterName: string, parameterValue: string): HttpRequestBuilder {
        this.matrixParameters.set(parameterName, parameterValue);
        return this;
    }

    /**
     * Add a cookie
     * @param cookie Cookie
     * @return this
     */
    withCookie(cookie: Cookie): HttpRequestBuilder {
        return this.withCookies(cookie);
    }

    /**
     * Add cookies
     * @param cookies Cookies
     * @return this
     */
    withCookies(...cookies: Array<Cookie>): HttpRequestBuilder {
        this.cookies.push(...cookies);
        return this;
    }

    /**
     * Build an HTTP request with the set properties
     * @return Built HTTP request
     */
    build(): HttpRequest {
        return new HttpRequest(this.method, this.path, this.queryParameters, this.matrixParameters, this.headers, this.cookies, this.payload);
    }

    /**
     * Build an HTTP request builder initialized with a method and path
     * @param httpMethod HTTP method
     * @param path       Path
     * @return HTTP request builder
     */
    static of(httpMethod: string, path: string): HttpRequestBuilder {
        return new HttpRequestBuilder(httpMethod, path);
    }

}

export {
    HttpRequestBuilder
};
