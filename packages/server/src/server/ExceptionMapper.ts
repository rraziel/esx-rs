import {HttpResponse} from '@esx-rs/http';

/**
 * Exception mapper
 * @param <E> Exception type
 */
abstract class ExceptionMapper<E> {
    private exceptionClass: Function;

    /**
     * Class constructor
     * @param exceptionClass Exception class
     */
    protected constructor(exceptionClass: Function) {
        this.exceptionClass = exceptionClass;
    }

    /**
     * Get the exception class
     * @return Exception class
     */
    getExceptionClass(): Function {
        return this.exceptionClass;
    }

    /**
     * Map the exception to an HTTP response
     * @param exception Exception
     * @return Promise that resolves to an HTTP response
     */
    abstract toResponse(exception: E): Promise<HttpResponse>;

}

export {
    ExceptionMapper
};
