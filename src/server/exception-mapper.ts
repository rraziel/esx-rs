import {HttpResponse} from '../http';

/**
 * Error mapper
 * @param <T> Exception type
 */
interface ExceptionMapper<T> {

    /**
     * Map the exception to an HTTP response
     * @param exception Exception
     * @return HTTP response
     */
    toResponse(exception: T): Promise<HttpResponse>;

}

export {
    ExceptionMapper
};
