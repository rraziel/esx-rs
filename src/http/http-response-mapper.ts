import {HttpHeaders} from './http-headers';
import {getHttpMethodFromString, HttpMethod} from './http-method';
import {HttpResponse} from './http-response';
import {HttpResponseBuilder} from './http-response-builder';
import {HttpRequest} from './http-request';
import {HttpStatuses} from './http-statuses';
import {MediaTypeUtils} from '../utils';
import {OperationInfo} from '../metadata';

const REGEXP_MEDIATYPE_JSON: RegExp = /\+json$/;

/**
 * HTTP response mapper
 */
class HttpResponseMapper {

    /**
     * Build an HTTP response from an operation result
     * @param operationInfo Operation information
     * @param httpRequest   HTTP request
     * @param result        Result
     * @param <T>           Result type
     * @return Promise that resolves to an HTTP response
     */
    async buildHttpResponse<T>(operationInfo: OperationInfo, httpRequest: HttpRequest, result: T): Promise<HttpResponse> {
        let httpResponseBuilder: HttpResponseBuilder = new HttpResponseBuilder();
        let httpMethod: HttpMethod = getHttpMethodFromString(httpRequest.getMethod());

        if (result) {
            let payload: string = this.buildHttpResponsePayload<T>(operationInfo, httpRequest, result);

            httpResponseBuilder
                .withStatus(HttpStatuses.OK)
                .withPayload(payload)
            ;
        } else {
            httpResponseBuilder.withStatus(HttpStatuses.OK_NOCONTENT);
        }

        return httpResponseBuilder.build();
    }

    /**
     * Build a response payload from an operation result
     * @param operationInfo Operation information
     * @param httpRequest   HTTP request
     * @param result        Result
     * @param <T>           Result type
     * @return Response payload
     */
    private buildHttpResponsePayload<T>(operationInfo: OperationInfo, httpRequest: HttpRequest, result: T): string {
        let requestedMediaTypes: string = httpRequest.getHeaderValue(HttpHeaders.ACCEPT);
        let expectedMediaType: string = MediaTypeUtils.getRequestedMediaType(requestedMediaTypes, operationInfo.producedMediaTypes);

        if (REGEXP_MEDIATYPE_JSON.test(expectedMediaType)) {
            return JSON.stringify(result);
        } else {
            return <string><any> result;
        }
    }

}

export {
    HttpResponseMapper
};
