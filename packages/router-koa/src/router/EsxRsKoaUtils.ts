import {Cookie, HttpHeader, HttpRequest, HttpResponse} from '@esx-rs/http';
import {Request, Response} from 'koa';

/**
 * ESX-RS with Koa utility functions
 */
class EsxRsKoaUtils {

    /**
     * Build an HTTP request from a Koa request
     * @param request Koa request
     * @return HTTP request
     */
    static buildHttpRequest(request: Request): HttpRequest {
        let method: string = request.method;
        let path: string = request.path;
        let queryParameters: Map<string, string> = EsxRsKoaUtils.buildQueryParameters(request);
        let matrixParameters: Map<string, string> = undefined;
        let headers: Array<HttpHeader> = this.buildHeaders(request);
        let cookies: Array<Cookie> = this.buildCookies(request);
        let payload: string = request.rawBody;

        return new HttpRequest(method, path, queryParameters, matrixParameters, headers, cookies, payload);
    }

    /**
     * Fill a Koa response based on an ESX-RS HTTP response
     * @param response     Response
     * @param httpResponse HTTP response
     */
    static fillResponse(response: Response, httpResponse: HttpResponse): void {
        let httpHeaders: Array<HttpHeader> = httpResponse.getHeaders();

        response.body = httpResponse.getPayload();
        response.status = httpResponse.getStatusCode();

        if (httpHeaders) {
            httpHeaders.forEach(httpHeader => response.set(httpHeader.getName(), httpHeader.getValue()));
        }

    }

    /**
     * Build headers from a Koa request
     * @param request Koa request
     * @return List of headers
     */
    private static buildHeaders(request: Request): Array<HttpHeader> {
        let httpHeaders: Array<HttpHeader> = [];

        for (let headerName in request.header) {
            httpHeaders.push(new HttpHeader(headerName, request.header[headerName]));
        }

        return httpHeaders;
    }

    /**
     * Build cookies from a Koa request
     * @param request Koa request
     * @return List of cookies
     */
    private static buildCookies(request: Request): Array<Cookie> {
        return null;
    }

    /**
     * Build query parameters from Koa query parameters
     * @param request Koa request
     * @return Query parameters
     */
    private static buildQueryParameters(request: Request): Map<string, string> {
        return null;
    }

}

export {
    EsxRsKoaUtils
};
