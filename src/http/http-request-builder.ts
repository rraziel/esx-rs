import {Cookie} from './cookie';
import {HttpHeader} from './http-header';
import {getStringFromHttpMethod, HttpMethod} from './http-method';
import {HttpRequest} from './http-request';

/**
 * HTTP request builder
 */
class HttpRequestBuilder {
    private queryParameters: Map<string, string> = new Map<string, string>();
    private httpHeaders: Array<HttpHeader> = new Array<HttpHeader>();
    private cookies: Array<Cookie> = new Array<Cookie>();
    private payload: string;
    private method: string;
    private path: string;

    withMethod(httpMethod: HttpMethod|string) {
        if (typeof(httpMethod) === 'string') {
            this.method = httpMethod;
        } else {
            this.method = getStringFromHttpMethod(httpMethod);
        }
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
     * Add a HTTP header
     * @param httpHeader HTTP header
     * @return this
     */
    withHeader(httpHeader: HttpHeader): HttpRequestBuilder {
        this.httpHeaders.push(httpHeader);
        return this;
    }

    /**
     * Add a cookie
     * @param cookie Cookie
     */
    withCookie(cookie: Cookie): HttpRequestBuilder {
        this.cookies.push(cookie);
        return this;
    }

    /**
     * Set the payload
     * @param payload Payload
     * @return this
     */
    withPayload(payload: string): HttpRequestBuilder {
        this.payload = payload;
        return this;
    }

    /**
     * Build an HTTP request with the set properties
     * @return HTTP request
     */
    build(): HttpRequest {
        return new HttpRequest(this.method, this.path, this.queryParameters, this.httpHeaders, this.cookies, this.payload);
    }

}

export {
    HttpRequestBuilder
};
