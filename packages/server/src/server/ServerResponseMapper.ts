import {CachedOperationInfo} from './CachedOperationInfo';
import {HttpHeader, HttpHeaders, HttpResponse, HttpResponseBuilder, HttpRequest, HttpStatuses} from '@esx-rs/http';
import {OperationInfo} from '@esx-rs/core';
import {MediaTypeUtils} from '../utils';

const REGEXP_MEDIATYPE_JSON: RegExp = /[\+\/]json$/;

/**
 * Server response mapper
 */
class ServerResponseMapper {

    /**
     * Build an HTTP response from an operation result
     * @param cachedOperationInfo Cached operation information
     * @param httpRequest         HTTP request
     * @param result              Result
     * @param <T>                 Result type
     * @return Promise that resolves to an HTTP response
     */
    async buildHttpResponse<T>(cachedOperationInfo: CachedOperationInfo, httpRequest: HttpRequest, result?: T): Promise<HttpResponse> {
        let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;
        let httpResponseBuilder: HttpResponseBuilder = new HttpResponseBuilder();
        let httpMethod: string = httpRequest.getMethod();

        if (result) {
            let requestedMediaTypes: string = httpRequest.getHeaderValue(HttpHeaders.ACCEPT);
            let expectedMediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationInfo.producedMediaTypes);
            let payload: string = this.buildHttpResponsePayload<T>(operationInfo, httpRequest, result, expectedMediaType);

            httpResponseBuilder
                .withStatus(HttpStatuses.OK)
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, expectedMediaType))
                .withPayload(payload)
            ;
        } else {
            httpResponseBuilder.withStatus(HttpStatuses.OK_NOCONTENT);
        }

        return httpResponseBuilder.build();
    }

    /**
     * Build an HTTP response from an operation error
     * @param cachedOperationInfo Cached operation information
     * @param httpRequest         HTTP request
     * @param error               Error
     * @return Promise that resolves to an HTTP response
     */
    async buildHttpErrorResponse(cachedOperationInfo: CachedOperationInfo, httpRequest: HttpRequest, error: any): Promise<HttpResponse> {
        return null;
    }

    /**
     * Build a response payload from an operation result
     * @param operationInfo     Operation information
     * @param httpRequest       HTTP request
     * @param result            Result
     * @param expectedMediaType Expected media type
     * @param <T>               Result type
     * @return Response payload
     */
    private buildHttpResponsePayload<T>(operationInfo: OperationInfo, httpRequest: HttpRequest, result: T, expectedMediaType: string): string {
        if (REGEXP_MEDIATYPE_JSON.test(expectedMediaType)) {
            return JSON.stringify(result);
        } else {
            return <string><any> result;
        }
    }

}

export {
    ServerResponseMapper
};
