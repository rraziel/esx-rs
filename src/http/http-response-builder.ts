import {AbstractHttpMessageBuilder} from './abstract-http-message-builder';
import {HttpResponse} from './http-response';

/**
 * HTTP response builder
 */
class HttpResponseBuilder extends AbstractHttpMessageBuilder {
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

}

export {
    HttpResponseBuilder
};
