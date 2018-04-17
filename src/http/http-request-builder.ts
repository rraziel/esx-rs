import {AbstractHttpMessageBuilder} from './abstract-http-message-builder';
import {Cookie} from './cookie';
import {HttpHeader} from './http-header';
import {getStringFromHttpMethod, HttpMethod} from './http-method';
import {HttpRequest} from './http-request';

/**
 * HTTP request builder
 */
class HttpRequestBuilder extends AbstractHttpMessageBuilder {
    private queryParameters: Map<string, string> = new Map<string, string>();
    private cookies: Array<Cookie>;
    private method: string;
    private path: string;

    /**
     * Set the method
     * @param httpMethod HTTP method
     * @return this
     */
    withMethod(httpMethod: HttpMethod|string): HttpRequestBuilder {
        if (typeof(httpMethod) === 'string') {
            this.method = httpMethod;
        } else {
            this.method = getStringFromHttpMethod(httpMethod);
        }

        return this;
    }

    /**
     * Set the request path
     * @param path Path
     * @return this
     */
    withPath(path: string): HttpRequestBuilder {
        this.path = path;
        return this;
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
     * Add a cookie
     * @param cookie Cookie
     */
    withCookie(cookie: Cookie): HttpRequestBuilder {
        this.cookies = this.cookies || new Array<Cookie>();
        this.cookies.push(cookie);
        return this;
    }

    /**
     * Build an HTTP request with the set properties
     * @return Built HTTP request
     */
    build(): HttpRequest {
        return new HttpRequest(this.method, this.path, this.queryParameters, this.headers, this.cookies, this.payload);
    }

}

export {
    HttpRequestBuilder
};
