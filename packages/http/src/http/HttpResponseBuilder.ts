import {AbstractHttpMessageBuilder} from './AbstractHttpMessageBuilder';
import {HttpResponse} from './HttpResponse';

/**
 * HTTP response builder
 */
class HttpResponseBuilder extends AbstractHttpMessageBuilder<HttpResponse> {
    private status: number;

    /**
     * Set the status code
     * @param statusCode Status code
     */
    withStatus(statusCode: number): HttpResponseBuilder {
        this.status = statusCode;
        return this;
    }

    /**
     * Build an HTTP response with the set properties
     * @return Built HTTP response
     */
    build(): HttpResponse {
        return new HttpResponse(this.status, this.headers, this.payload);
    }

    /**
     * Build an HTTP response builder initialized with a status code
     * @param statusCode Status code
     * @return HTTP response builder
     */
    static of(statusCode: number): HttpResponseBuilder {
        return new HttpResponseBuilder().withStatus(statusCode);
    }

}

export {
    HttpResponseBuilder
};
