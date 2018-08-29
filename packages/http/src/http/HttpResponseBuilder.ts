import { AbstractHttpMessageBuilder } from './AbstractHttpMessageBuilder';
import { HttpResponse } from './HttpResponse';

/**
 * HTTP response builder
 */
class HttpResponseBuilder extends AbstractHttpMessageBuilder<HttpResponse> {
    private readonly statusCode: number;

    /**
     * Class constructor
     * @param statusCode Status code
     */
    private constructor(statusCode: number) {
        super();
        this.statusCode = statusCode;
    }

    /**
     * Build an HTTP response with the set properties
     * @return Built HTTP response
     */
    build(): HttpResponse {
        return new HttpResponse(this.statusCode, this.headers, this.payload);
    }

    /**
     * Build an HTTP response builder initialized with a status code
     * @param statusCode Status code
     * @return HTTP response builder
     */
    static of(statusCode: number): HttpResponseBuilder {
        return new HttpResponseBuilder(statusCode);
    }

}

export {
    HttpResponseBuilder
};
