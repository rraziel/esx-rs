import {HttpResponse} from './http-response';
import {OperationInfo} from '../metadata';

/**
 * HTTP response mapper
 */
class HttpResponseMapper {

    /**
     * Build an HTTP response from an operation result
     * @param operationInfo Operation information
     * @param result        Result
     * @return Promise that resolves to an HTTP response
     */
    async buildHttpResponse<T>(operationInfo: OperationInfo, result: T): Promise<HttpResponse> {
        return null;
    }

}

export {
    HttpResponseMapper
};
