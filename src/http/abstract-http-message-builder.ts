import {HttpHeader} from './http-header';

/**
 * Abstract HTTP message builder
 */
abstract class AbstractHttpMessageBuilder {
    protected headers?: Array<HttpHeader>;
    protected payload?: string;

    /**
     * Add a HTTP header
     * @param httpHeader HTTP header
     * @return this
     */
    withHeader(httpHeader: HttpHeader): AbstractHttpMessageBuilder {
        return this.withHeaders(httpHeader);
    }

    /**
     * Add HTTP headers
     * @param httpHeaders HTTP headers
     * @return this
     */
    withHeaders(...httpHeaders: HttpHeader[]): AbstractHttpMessageBuilder {
        this.headers = this.headers || new Array<HttpHeader>();
        httpHeaders.forEach(httpHeader => this.headers.push(httpHeader));
        return this;
    }

    /**
     * Set the payload
     * @param payload Payload
     * @return this
     */
    withPayload(payload: string): AbstractHttpMessageBuilder {
        this.payload = payload;
        return this;
    }

}

export {
    AbstractHttpMessageBuilder
};
